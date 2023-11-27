

CREATE TABLE users
(
    id         SERIAL PRIMARY KEY,
    login      VARCHAR(255) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name  VARCHAR(255) NOT NULL,
    phone      VARCHAR(20),
    CONSTRAINT unique_login UNIQUE (login),
    CONSTRAINT unique_phone UNIQUE (phone)
);
