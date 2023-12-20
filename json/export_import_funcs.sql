-- Удаление существующих функций
-- DROP FUNCTION EXPORT_USER_TO_JSON_FILE; DROP FUNCTION IMPORT_USER_FROM_JSON_FILE;

-- Экспорт данных в JSON файл
CREATE OR REPLACE FUNCTION EXPORT_USER_TO_JSON_FILE(FILE_PATH TEXT)
RETURNS VOID AS
$$
DECLARE
    JSON_DATA JSON;
BEGIN
    BEGIN
        SELECT JSON_AGG(ROW_TO_JSON("user")) INTO JSON_DATA FROM "user";
        PERFORM PG_FILE_WRITE(FILE_PATH, JSON_DATA::TEXT, TRUE);
    EXCEPTION WHEN OTHERS THEN
        RAISE 'Произошла ошибка: %', SQLERRM;
    END;
END;
$$
LANGUAGE PLPGSQL;

-- Импорт данных из JSON файла
-- Импорт данных из JSON файла
CREATE OR REPLACE FUNCTION IMPORT_USER_FROM_JSON_FILE(FILE_PATH TEXT)
RETURNS TABLE (
    id              integer,
    email           varchar,
    username        varchar,
    registered_at   timestamp,
    hashed_password varchar(1024),
    is_active       boolean,
    is_superuser    boolean,
    is_verified     boolean
) AS
$$
DECLARE
    FILE_CONTENT TEXT;
    JSON_DATA JSON;
    USER_DATA JSON;
BEGIN
    CREATE TEMP TABLE IF NOT EXISTS temp_user (
        id              integer,
        email           varchar,
        username        varchar,
        registered_at   timestamp,
        hashed_password varchar(1024),
        is_active       boolean,
        is_superuser    boolean,
        is_verified     boolean
    );

    DELETE FROM temp_user;

    BEGIN
        FILE_CONTENT := pg_read_file(FILE_PATH, 0, 1000000000);
    EXCEPTION WHEN OTHERS THEN
        RAISE 'Файл не найден: %', FILE_PATH;
    END;

    BEGIN
        JSON_DATA := FILE_CONTENT::JSON;
    EXCEPTION WHEN OTHERS THEN
        RAISE 'Некорректный JSON: %', SQLERRM;
    END;

    FOR USER_DATA IN SELECT * FROM json_array_elements(JSON_DATA)
    LOOP
        IF NOT (USER_DATA::jsonb ? 'id' AND USER_DATA::jsonb ? 'email' AND USER_DATA::jsonb ? 'username' AND USER_DATA::jsonb ? 'registered_at' AND USER_DATA::jsonb ? 'hashed_password' AND USER_DATA::jsonb ? 'is_active' AND USER_DATA::jsonb ? 'is_superuser' AND USER_DATA::jsonb ? 'is_verified') THEN
            CONTINUE;
        END IF;

        INSERT INTO temp_user (id, email, username, registered_at, hashed_password, is_active, is_superuser, is_verified)
        VALUES (
            (USER_DATA->>'id')::integer,
            USER_DATA->>'email',
            USER_DATA->>'username',
            (USER_DATA->>'registered_at')::timestamp,
            USER_DATA->>'hashed_password',
            (USER_DATA->>'is_active')::boolean,
            (USER_DATA->>'is_superuser')::boolean,
            (USER_DATA->>'is_verified')::boolean
        );
    END LOOP;

    RETURN QUERY SELECT * FROM temp_user;
END;
$$
LANGUAGE PLPGSQL;

CREATE EXTENSION adminpack;
SELECT EXPORT_USER_TO_JSON_FILE('D:\Code\Courses Projects\DB\json\export.json');
SELECT * FROM IMPORT_USER_FROM_JSON_FILE('D:\Code\Courses Projects\DB\json\export.json');