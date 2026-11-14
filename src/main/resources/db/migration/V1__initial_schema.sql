--
-- PostgreSQL database dump
--

-- Dumped from database version 15.19
-- Dumped by pg_dump version 15.19

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accounts (
    id uuid NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    initial_balance numeric(38,2) NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(255) NOT NULL,
    user_id uuid NOT NULL,
    CONSTRAINT accounts_type_check CHECK (((type)::text = ANY ((ARRAY['CASH'::character varying, 'CARD'::character varying])::text[])))
);


--
-- Name: budgets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.budgets (
    id uuid NOT NULL,
    amount numeric(38,2) NOT NULL,
    category_id uuid NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    month integer NOT NULL,
    user_id uuid NOT NULL,
    year integer NOT NULL
);


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id uuid NOT NULL,
    global boolean NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(255) NOT NULL,
    user_id uuid,
    CONSTRAINT categories_type_check CHECK (((type)::text = ANY ((ARRAY['INCOME'::character varying, 'EXPENSE'::character varying])::text[])))
);


--
-- Name: recurring_transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recurring_transactions (
    id uuid NOT NULL,
    account_id uuid,
    active boolean NOT NULL,
    amount numeric(38,2),
    category_id uuid,
    created_at timestamp(6) without time zone,
    end_date date,
    frequency character varying(255),
    next_execution_date date,
    note character varying(255),
    start_date date,
    type character varying(255),
    user_id uuid,
    CONSTRAINT recurring_transactions_frequency_check CHECK (((frequency)::text = ANY ((ARRAY['WEEKLY'::character varying, 'MONTHLY'::character varying, 'YEARLY'::character varying])::text[]))),
    CONSTRAINT recurring_transactions_type_check CHECK (((type)::text = ANY ((ARRAY['INCOME'::character varying, 'EXPENSE'::character varying])::text[])))
);


--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.refresh_tokens (
    id uuid NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    expires_at timestamp(6) without time zone NOT NULL,
    revoked boolean NOT NULL,
    token character varying(255) NOT NULL,
    user_id uuid NOT NULL
);


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.transactions (
    id uuid NOT NULL,
    account_id uuid NOT NULL,
    amount numeric(38,2) NOT NULL,
    category_id uuid NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    date_time timestamp(6) without time zone NOT NULL,
    note character varying(255),
    transaction_type character varying(255) NOT NULL,
    user_id uuid NOT NULL,
    CONSTRAINT transactions_transaction_type_check CHECK (((transaction_type)::text = ANY ((ARRAY['INCOME'::character varying, 'EXPENSE'::character varying])::text[])))
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    email character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL
);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: budgets budgets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT budgets_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: recurring_transactions recurring_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recurring_transactions
    ADD CONSTRAINT recurring_transactions_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: users uk6dotkott2kjsp8vw4d0m25fb7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk6dotkott2kjsp8vw4d0m25fb7 UNIQUE (email);


--
-- Name: refresh_tokens ukghpmfn23vmxfu3spu3lfg4r2d; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT ukghpmfn23vmxfu3spu3lfg4r2d UNIQUE (token);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

