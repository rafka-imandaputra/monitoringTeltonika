--
-- NOTE:
--
-- File paths need to be edited. Search for $$PATH$$ and
-- replace it with the path to the directory containing
-- the extracted data files.
--
--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE teltonika_baru;
--
-- Name: teltonika_baru; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE teltonika_baru WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Indonesia.1252';


ALTER DATABASE teltonika_baru OWNER TO postgres;

\connect teltonika_baru

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: log_alat_changes(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_alat_changes() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Log insert operation
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO RIWAYAT (ROUTE_ID, ID_ALAT, IMEI, ID_SEWA, NAMA_ALAT, STATUSALAT2, SUHU2, LOG_LATITUDE, LOG_LONGITUDE, TIMESTAMPLOG, ACTION_TYPE_FROM_ALAT)
        SELECT 
			PERJALANAN.route_id,
			NEW.id_alat,
			NEW.imei,
			NEW.id_sewa,
			NEW.namaalat,
			NEW.statusalat,
			NEW.suhu,
			NEW.latitude,
			NEW.longitude,
			CURRENT_TIMESTAMP,
			'INSERT'
		FROM ALAT INNER JOIN SEWA ON ALAT.ID_SEWA = SEWA.ID_SEWA INNER JOIN PERJALANAN ON SEWA.ID_SEWA = PERJALANAN.ID_SEWA WHERE SEWA.ID_SEWA = PERJALANAN.ID_SEWA;
        RETURN NEW;
    -- Log update operation
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO RIWAYAT (ROUTE_ID, ID_ALAT, IMEI, ID_SEWA, NAMA_ALAT, STATUSALAT2, SUHU2, LOG_LATITUDE, LOG_LONGITUDE, TIMESTAMPLOG, ACTION_TYPE_FROM_ALAT)
        SELECT 
			PERJALANAN.route_id,
			NEW.id_alat,
			NEW.imei,
			NEW.id_sewa,
			NEW.namaalat,
			NEW.statusalat,
			NEW.suhu,
			NEW.latitude,
			NEW.longitude,
			CURRENT_TIMESTAMP,
			'UPDATE'
		FROM ALAT INNER JOIN SEWA ON ALAT.ID_SEWA = SEWA.ID_SEWA INNER JOIN PERJALANAN ON SEWA.ID_SEWA = PERJALANAN.ID_SEWA WHERE SEWA.ID_SEWA = PERJALANAN.ID_SEWA;
        RETURN NEW;
    -- Log delete operation
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO riwayat (alat_id, alat_name, alat_type, suhu, action_type)
        VALUES (OLD.alat_id, OLD.alat_name, OLD.alat_type, OLD.suhu, 'DELETE');
        RETURN OLD;
    END IF;
END;
$$;


ALTER FUNCTION public.log_alat_changes() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin (
    id_admin integer NOT NULL,
    namaadmin character varying(50) NOT NULL,
    passwordadmin character varying(50) NOT NULL,
    kontakadmin character varying(15)
);


ALTER TABLE public.admin OWNER TO postgres;

--
-- Name: admin_id_admin_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admin_id_admin_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_id_admin_seq OWNER TO postgres;

--
-- Name: admin_id_admin_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admin_id_admin_seq OWNED BY public.admin.id_admin;


--
-- Name: alat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alat (
    id_alat integer NOT NULL,
    imei character varying(20) NOT NULL,
    id_sewa integer,
    namaalat character varying(50),
    statusalat character varying(10),
    latitude numeric(8,6),
    longitude numeric(9,6),
    suhu numeric
);


ALTER TABLE public.alat OWNER TO postgres;

--
-- Name: alat_id_alat_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.alat_id_alat_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alat_id_alat_seq OWNER TO postgres;

--
-- Name: alat_id_alat_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.alat_id_alat_seq OWNED BY public.alat.id_alat;


--
-- Name: client; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client (
    id_client integer NOT NULL,
    id_admin integer NOT NULL,
    namaclient character varying(50) NOT NULL,
    password_client character varying(50) NOT NULL,
    kontakclient character varying(50),
    email character varying(50),
    jalan character varying(50),
    kecamatan character varying(50),
    kabupaten character varying(50),
    provinsi character varying(50)
);


ALTER TABLE public.client OWNER TO postgres;

--
-- Name: client_id_client_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.client_id_client_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.client_id_client_seq OWNER TO postgres;

--
-- Name: client_id_client_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.client_id_client_seq OWNED BY public.client.id_client;


--
-- Name: commodity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.commodity (
    id_commodity integer NOT NULL,
    route_id integer NOT NULL,
    namabarang character varying(50),
    descbarang character varying(100),
    beratbarang double precision
);


ALTER TABLE public.commodity OWNER TO postgres;

--
-- Name: commodity_id_commodity_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.commodity_id_commodity_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.commodity_id_commodity_seq OWNER TO postgres;

--
-- Name: commodity_id_commodity_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.commodity_id_commodity_seq OWNED BY public.commodity.id_commodity;


--
-- Name: perjalanan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.perjalanan (
    route_id integer NOT NULL,
    id_sewa integer NOT NULL,
    startlatitude numeric(8,6),
    startlongitude numeric(9,6),
    endlatitude numeric(8,6),
    endlongitude numeric(9,6)
);


ALTER TABLE public.perjalanan OWNER TO postgres;

--
-- Name: perjalanan_route_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.perjalanan_route_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.perjalanan_route_id_seq OWNER TO postgres;

--
-- Name: perjalanan_route_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.perjalanan_route_id_seq OWNED BY public.perjalanan.route_id;


--
-- Name: riwayat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.riwayat (
    route_id integer,
    id_alat integer NOT NULL,
    imei character varying(50),
    id_sewa integer NOT NULL,
    nama_alat character varying(50),
    statusalat2 character varying(10),
    suhu2 numeric,
    log_latitude numeric(8,6),
    log_longitude numeric(9,6),
    timestamplog timestamp without time zone,
    action_type_from_alat character varying(50)
);


ALTER TABLE public.riwayat OWNER TO postgres;

--
-- Name: riwayat_id_alat_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.riwayat_id_alat_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.riwayat_id_alat_seq OWNER TO postgres;

--
-- Name: riwayat_id_alat_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.riwayat_id_alat_seq OWNED BY public.riwayat.id_alat;


--
-- Name: riwayat_id_sewa_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.riwayat_id_sewa_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.riwayat_id_sewa_seq OWNER TO postgres;

--
-- Name: riwayat_id_sewa_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.riwayat_id_sewa_seq OWNED BY public.riwayat.id_sewa;


--
-- Name: sewa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sewa (
    id_sewa integer NOT NULL,
    id_client integer NOT NULL,
    imei character varying(20) NOT NULL,
    tanggalawalsewa date,
    tanggalakhirsewa date
);


ALTER TABLE public.sewa OWNER TO postgres;

--
-- Name: sewa_id_sewa_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sewa_id_sewa_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sewa_id_sewa_seq OWNER TO postgres;

--
-- Name: sewa_id_sewa_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sewa_id_sewa_seq OWNED BY public.sewa.id_sewa;


--
-- Name: admin id_admin; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin ALTER COLUMN id_admin SET DEFAULT nextval('public.admin_id_admin_seq'::regclass);


--
-- Name: alat id_alat; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alat ALTER COLUMN id_alat SET DEFAULT nextval('public.alat_id_alat_seq'::regclass);


--
-- Name: client id_client; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client ALTER COLUMN id_client SET DEFAULT nextval('public.client_id_client_seq'::regclass);


--
-- Name: commodity id_commodity; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commodity ALTER COLUMN id_commodity SET DEFAULT nextval('public.commodity_id_commodity_seq'::regclass);


--
-- Name: perjalanan route_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perjalanan ALTER COLUMN route_id SET DEFAULT nextval('public.perjalanan_route_id_seq'::regclass);


--
-- Name: riwayat id_alat; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.riwayat ALTER COLUMN id_alat SET DEFAULT nextval('public.riwayat_id_alat_seq'::regclass);


--
-- Name: riwayat id_sewa; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.riwayat ALTER COLUMN id_sewa SET DEFAULT nextval('public.riwayat_id_sewa_seq'::regclass);


--
-- Name: sewa id_sewa; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sewa ALTER COLUMN id_sewa SET DEFAULT nextval('public.sewa_id_sewa_seq'::regclass);


--
-- Data for Name: admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin (id_admin, namaadmin, passwordadmin, kontakadmin) FROM stdin;
\.
COPY public.admin (id_admin, namaadmin, passwordadmin, kontakadmin) FROM '$$PATH$$/4897.dat';

--
-- Data for Name: alat; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alat (id_alat, imei, id_sewa, namaalat, statusalat, latitude, longitude, suhu) FROM stdin;
\.
COPY public.alat (id_alat, imei, id_sewa, namaalat, statusalat, latitude, longitude, suhu) FROM '$$PATH$$/4903.dat';

--
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.client (id_client, id_admin, namaclient, password_client, kontakclient, email, jalan, kecamatan, kabupaten, provinsi) FROM stdin;
\.
COPY public.client (id_client, id_admin, namaclient, password_client, kontakclient, email, jalan, kecamatan, kabupaten, provinsi) FROM '$$PATH$$/4899.dat';

--
-- Data for Name: commodity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.commodity (id_commodity, route_id, namabarang, descbarang, beratbarang) FROM stdin;
\.
COPY public.commodity (id_commodity, route_id, namabarang, descbarang, beratbarang) FROM '$$PATH$$/4907.dat';

--
-- Data for Name: perjalanan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.perjalanan (route_id, id_sewa, startlatitude, startlongitude, endlatitude, endlongitude) FROM stdin;
\.
COPY public.perjalanan (route_id, id_sewa, startlatitude, startlongitude, endlatitude, endlongitude) FROM '$$PATH$$/4905.dat';

--
-- Data for Name: riwayat; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.riwayat (route_id, id_alat, imei, id_sewa, nama_alat, statusalat2, suhu2, log_latitude, log_longitude, timestamplog, action_type_from_alat) FROM stdin;
\.
COPY public.riwayat (route_id, id_alat, imei, id_sewa, nama_alat, statusalat2, suhu2, log_latitude, log_longitude, timestamplog, action_type_from_alat) FROM '$$PATH$$/4910.dat';

--
-- Data for Name: sewa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sewa (id_sewa, id_client, imei, tanggalawalsewa, tanggalakhirsewa) FROM stdin;
\.
COPY public.sewa (id_sewa, id_client, imei, tanggalawalsewa, tanggalakhirsewa) FROM '$$PATH$$/4901.dat';

--
-- Name: admin_id_admin_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admin_id_admin_seq', 5, true);


--
-- Name: alat_id_alat_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.alat_id_alat_seq', 46, true);


--
-- Name: client_id_client_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.client_id_client_seq', 5, true);


--
-- Name: commodity_id_commodity_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.commodity_id_commodity_seq', 15, true);


--
-- Name: perjalanan_route_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.perjalanan_route_id_seq', 15, true);


--
-- Name: riwayat_id_alat_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.riwayat_id_alat_seq', 1, false);


--
-- Name: riwayat_id_sewa_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.riwayat_id_sewa_seq', 1, false);


--
-- Name: sewa_id_sewa_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sewa_id_sewa_seq', 10, true);


--
-- Name: admin pk_admin; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT pk_admin PRIMARY KEY (id_admin);


--
-- Name: alat pk_alat; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alat
    ADD CONSTRAINT pk_alat PRIMARY KEY (imei);


--
-- Name: client pk_client; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT pk_client PRIMARY KEY (id_client);


--
-- Name: commodity pk_commodity; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commodity
    ADD CONSTRAINT pk_commodity PRIMARY KEY (id_commodity);


--
-- Name: perjalanan pk_perjalanan; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perjalanan
    ADD CONSTRAINT pk_perjalanan PRIMARY KEY (route_id);


--
-- Name: sewa pk_sewa; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sewa
    ADD CONSTRAINT pk_sewa PRIMARY KEY (id_sewa);


--
-- Name: idx_alat_sewa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_alat_sewa ON public.alat USING btree (id_sewa);


--
-- Name: idx_client_admin; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_client_admin ON public.client USING btree (id_admin);


--
-- Name: idx_perjalanan_sewa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_perjalanan_sewa ON public.perjalanan USING btree (id_sewa);


--
-- Name: idx_sewa_client; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sewa_client ON public.sewa USING btree (id_client);


--
-- Name: idx_sewa_imei; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sewa_imei ON public.sewa USING btree (imei);


--
-- Name: alat log_alat_changes_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER log_alat_changes_trigger AFTER INSERT OR DELETE OR UPDATE ON public.alat FOR EACH ROW EXECUTE FUNCTION public.log_alat_changes();


--
-- Name: alat fk_alat_sewa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alat
    ADD CONSTRAINT fk_alat_sewa FOREIGN KEY (id_sewa) REFERENCES public.sewa(id_sewa) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: client fk_client_admin; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT fk_client_admin FOREIGN KEY (id_admin) REFERENCES public.admin(id_admin) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: commodity fk_commodity_perjalanan; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commodity
    ADD CONSTRAINT fk_commodity_perjalanan FOREIGN KEY (route_id) REFERENCES public.perjalanan(route_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: perjalanan fk_perjalanan_sewa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perjalanan
    ADD CONSTRAINT fk_perjalanan_sewa FOREIGN KEY (id_sewa) REFERENCES public.sewa(id_sewa) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: riwayat fk_riwayat_alat; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.riwayat
    ADD CONSTRAINT fk_riwayat_alat FOREIGN KEY (imei) REFERENCES public.alat(imei) ON DELETE CASCADE;


--
-- Name: riwayat fk_riwayat_perjalanan; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.riwayat
    ADD CONSTRAINT fk_riwayat_perjalanan FOREIGN KEY (route_id) REFERENCES public.perjalanan(route_id) ON DELETE CASCADE;


--
-- Name: sewa fk_sewa_client; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sewa
    ADD CONSTRAINT fk_sewa_client FOREIGN KEY (id_client) REFERENCES public.client(id_client) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

