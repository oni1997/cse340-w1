-- Create custom type
CREATE TYPE account_type AS ENUM ('Client', 'Employee', 'Admin');

-- Create classification table
CREATE TABLE classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(30) NOT NULL UNIQUE
);

-- Create account table
CREATE TABLE account (
    account_id SERIAL PRIMARY KEY,
    account_firstname VARCHAR(20) NOT NULL,
    account_lastname VARCHAR(20) NOT NULL,
    account_email VARCHAR(320) NOT NULL UNIQUE,
    account_password VARCHAR(60) NOT NULL,
    account_type account_type DEFAULT 'Client'
);

-- Create inventory table
CREATE TABLE inventory (
    inv_id SERIAL PRIMARY KEY,
    inv_make VARCHAR(30) NOT NULL,
    inv_model VARCHAR(30) NOT NULL,
    inv_year CHAR(4) NOT NULL,
    inv_description TEXT NOT NULL,
    inv_image VARCHAR(50) NOT NULL,
    inv_thumbnail VARCHAR(50) NOT NULL,
    inv_price DECIMAL(8,2) NOT NULL,
    inv_miles INT NOT NULL,
    inv_color VARCHAR(20) NOT NULL,
    classification_id INT NOT NULL,
    FOREIGN KEY (classification_id) REFERENCES classification (classification_id) ON DELETE CASCADE
);

-- Populate classification table
INSERT INTO classification (classification_name) VALUES 
('Custom'),
('Sport'),
('SUV'),
('Truck'),
('Sedan');

-- Populate inventory table (example data - adjust based on your specific data)
INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES 
('GM', 'Hummer', '2021', 'This vehicle has an interior with small interiors and fits 5 people comfortably.', '/images/hummer.jpg', '/images/hummer-tn.jpg', 31895.00, 15000, 'Yellow', 2),
('Lamborghini', 'Aventador', '2022', 'A high-performance sports car with exceptional speed and handling.', '/images/lamborghini.jpg', '/images/lamborghini-tn.jpg', 393695.00, 2500, 'Orange', 2);

-- Copy of Query 4 from Task 1 (run last)
UPDATE inventory 
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior') 
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Copy of Query 6 from Task 1 (run last)
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');

-- Create reviews table for customer reviews and ratings
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    inv_id INT NOT NULL,
    account_id INT NOT NULL,
    review_title VARCHAR(100) NOT NULL,
    review_text TEXT NOT NULL,
    review_rating INT NOT NULL CHECK (review_rating >= 1 AND review_rating <= 5),
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inv_id) REFERENCES inventory (inv_id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES account (account_id) ON DELETE CASCADE,
    UNIQUE(inv_id, account_id) -- One review per customer per vehicle
);