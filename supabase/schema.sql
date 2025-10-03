-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'staff', 'admin')),
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration INTEGER NOT NULL, -- in minutes
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staff table
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    specialty TEXT NOT NULL,
    calendly_url TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'succeeded', 'failed', 'refunded')),
    stripe_payment_id TEXT,
    calendly_event_uri TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    stripe_charge_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_bookings_client ON bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_staff ON bookings(staff_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date_time);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Services policies (public read, admin write)
CREATE POLICY "Anyone can view services" ON services
    FOR SELECT USING (true);

CREATE POLICY "Only admins can insert services" ON services
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
    );

CREATE POLICY "Only admins can update services" ON services
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
    );

-- Staff policies
CREATE POLICY "Anyone can view staff" ON staff
    FOR SELECT USING (true);

CREATE POLICY "Staff can update their own profile" ON staff
    FOR UPDATE USING (
        user_id::text = auth.uid()::text OR
        EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
    );

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON bookings
    FOR SELECT USING (
        client_id::text = auth.uid()::text OR
        staff_id IN (SELECT id FROM staff WHERE user_id::text = auth.uid()::text) OR
        EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
    );

CREATE POLICY "Clients can create bookings" ON bookings
    FOR INSERT WITH CHECK (client_id::text = auth.uid()::text);

CREATE POLICY "Clients and staff can update bookings" ON bookings
    FOR UPDATE USING (
        client_id::text = auth.uid()::text OR
        staff_id IN (SELECT id FROM staff WHERE user_id::text = auth.uid()::text) OR
        EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
    );

-- Payments policies
CREATE POLICY "Users can view their own payments" ON payments
    FOR SELECT USING (
        booking_id IN (SELECT id FROM bookings WHERE client_id::text = auth.uid()::text) OR
        EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
    );

-- Insert sample data
INSERT INTO services (name, description, price, duration, image_url) VALUES
('Luxury Haircut', 'Premium haircut with styling consultation', 150.00, 60, 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=500'),
('Hair Coloring', 'Full hair coloring service with color protection treatment', 250.00, 120, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500'),
('Deluxe Facial', 'Luxury facial with organic products', 200.00, 90, 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500'),
('Manicure & Pedicure', 'Complete nail care and polish', 120.00, 75, 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500'),
('Hair Treatment', 'Deep conditioning and repair treatment', 180.00, 60, 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500'),
('Bridal Package', 'Complete bridal hair and makeup service', 500.00, 180, 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500');
