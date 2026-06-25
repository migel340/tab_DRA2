INSERT INTO personel (first_name, surname, role, username, password, active)
VALUES
    ('Kamil', 'Bednarek', 'MANAGER', 'kb', '$2b$10$miNUkAMoekyEw2cmTeDPnuglD3UnCjTifqFXEha.AuR1zlGzrWFYe', true),
    ('Maria', 'Mucha', 'MANAGER', 'mm', '$2b$10$wJd11IbLE3nrt5q90uap0Ox7ZK9Xgwp0E9aiAKni.crVyOpRfI/0K', true),
    ('Jan', 'Kowalski', 'STAFF', 'jk', '$2b$10$hAHQ7GZCu5odG.mIYbsDseJ8oLtwHIaiXGzql7T81rzaGhyFhXV3C', true),
    ('Władzimierz', 'Bułka', 'STAFF', 'wb', '$2b$10$11XKO/g7cWSmimPGcLr6xeN0nzaFIcvscXTacRMT6kVroorMoIiSK', true)
ON CONFLICT (username) DO NOTHING;

INSERT INTO device_type (device_type_name)
VALUES
    ('Laptop'),
    ('Smartphone'),
    ('Tablet'),
    ('PC')
ON CONFLICT (device_type_name) DO NOTHING;

INSERT INTO activity_type (act_type)
VALUES
    ('Czyszczenie'),
    ('Naprawa'),
    ('Wymiana'),
    ('Diagnostyka'),
    ('Konfiguracja'),
    ('Instalacja'),
    ('Konserwacja'),
    ('Konsultacja')
ON CONFLICT DO NOTHING;


INSERT INTO address (city, state, postal_code, country)
VALUES
    ('Warszawa', 'Mazowieckie', '00-001', 'Polska'),
    ('Kraków', 'Małopolskie', '30-001', 'Polska'),
    ('Gdańsk', 'Pomorskie', '80-001', 'Polska'),
    ('Wrocław', 'Dolnośląskie', '50-001', 'Polska'),
    ('Poznań', 'Wielkopolskie', '60-001', 'Polska');


INSERT INTO client (first_name, surname, second_name, phone_number, birth_date, id_address)
VALUES
    ('Anna', 'Nowak', NULL, '500100200', '1990-05-15', 1),
    ('Piotr', 'Wiśniewski', 'Tomasz', '600200300', '1985-11-22', 2),
    ('Katarzyna', 'Zielińska', NULL, '700300400', '1995-03-08', 3),
    ('Marek', 'Wójcik', 'Jan', '800400500', '1978-09-30', 4),
    ('Ewa', 'Kowalczyk', NULL, '900500600', '2000-01-12', 5);


INSERT INTO device (id_device_type, id_client, device_name)
VALUES
    (1, 1, 'Dell Latitude 5540'),
    (2, 1, 'Samsung Galaxy S24'),
    (3, 2, 'iPad Pro 12.9'),
    (4, 2, 'HP ProDesk 400 G7'),
    (1, 3, 'Lenovo ThinkPad T14'),
    (2, 3, 'iPhone 15 Pro'),
    (4, 4, 'Dell OptiPlex 7010'),
    (3, 4, 'Microsoft Surface Go 3'),
    (1, 5, 'ASUS ZenBook 14'),
    (2, 5, 'Xiaomi 14 Ultra');


INSERT INTO request (id_device, id_manager, description, status, date_registered, date_finished_canceled, result)
VALUES
    (1, 1, 'Laptop nie uruchamia się po aktualizacji BIOS', 'Nowy', '2026-06-20', NULL, NULL),
    (2, 1, 'Pęknięty ekran smartfona', 'W trakcie', '2026-06-18', NULL, NULL),
    (3, 2, 'Tablet nie ładuje się - problem z portem USB-C', 'Nowy', '2026-06-22', NULL, NULL),
    (4, 2, 'Komputer przegrzewa się i wyłącza', 'W trakcie', '2026-06-15', NULL, NULL),
    (5, 1, 'Wymiana dysku SSD na większy', 'Zakończony', '2026-06-10', '2026-06-14', 'Wymieniono dysk SSD 256GB na 1TB, dane przeniesione'),
    (7, 2, 'Instalacja systemu Windows 11 Pro', 'Zakończony', '2026-06-08', '2026-06-09', 'System zainstalowany, sterowniki zaktualizowane');


INSERT INTO activity (act_type, id_request, id_personel, seq_no, description, result, status, date_registered, date_finished_canceled)
VALUES
    (4, 1, 3, '1.1', 'Diagnostyka płyty głównej i zasilania', NULL, 'Nowy', '2026-06-20 10:00:00', NULL),
    (4, 2, 3, '2.1', 'Diagnostyka uszkodzeń ekranu', 'Ekran wymaga pełnej wymiany', 'Zakończony', '2026-06-18 09:00:00', '2026-06-18 11:00:00'),
    (3, 2, 4, '2.2', 'Wymiana ekranu na nowy', NULL, 'W trakcie', '2026-06-19 08:30:00', NULL),
    (4, 3, 4, '3.1', 'Diagnostyka portu ładowania USB-C', NULL, 'Nowy', '2026-06-22 14:00:00', NULL),
    (4, 4, 3, '4.1', 'Diagnostyka temperatury komponentów', 'Wentylator procesora nie działa prawidłowo', 'Zakończony', '2026-06-15 10:00:00', '2026-06-15 12:00:00'),
    (1, 4, 4, '4.2', 'Czyszczenie wnętrza komputera z kurzu', 'Usunięto nagromadzony kurz', 'Zakończony', '2026-06-16 09:00:00', '2026-06-16 11:00:00'),
    (3, 4, 3, '4.3', 'Wymiana pasty termoprzewodzącej', NULL, 'W trakcie', '2026-06-17 10:00:00', NULL),
    (4, 5, 3, '5.1', 'Diagnostyka kompatybilności nowego SSD', 'SSD NVMe M.2 kompatybilny', 'Zakończony', '2026-06-10 09:00:00', '2026-06-10 10:30:00'),
    (3, 5, 4, '5.2', 'Wymiana dysku SSD 256GB na 1TB', 'Dysk wymieniony pomyślnie', 'Zakończony', '2026-06-11 08:00:00', '2026-06-11 14:00:00'),
    (5, 5, 3, '5.3', 'Konfiguracja systemu na nowym dysku', 'System skonfigurowany, dane przeniesione', 'Zakończony', '2026-06-12 09:00:00', '2026-06-14 16:00:00'),
    (6, 6, 4, '6.1', 'Instalacja systemu Windows 11 Pro', 'System zainstalowany', 'Zakończony', '2026-06-08 10:00:00', '2026-06-08 14:00:00'),
    (5, 6, 4, '6.2', 'Konfiguracja sterowników i aktualizacji', 'Wszystkie sterowniki zaktualizowane', 'Zakończony', '2026-06-09 08:00:00', '2026-06-09 12:00:00');
