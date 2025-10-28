--
-- PostgreSQL database dump
--

\restrict pSWWCarc3ynu0TRNJK2HDIdDGXgdleXbhFvb1apFBUEn73kY82LHOMj0GTaHLBq

-- Dumped from database version 15.14 (Debian 15.14-1.pgdg13+1)
-- Dumped by pg_dump version 15.14 (Debian 15.14-1.pgdg13+1)

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
-- Name: avaliacoes; Type: TABLE; Schema: public; Owner: render_bd_v2_user
--

CREATE TABLE public.avaliacoes (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    nome_avaliador character varying(255) NOT NULL,
    nota integer NOT NULL,
    comentario text,
    data timestamp without time zone DEFAULT now(),
    CONSTRAINT avaliacoes_nota_check CHECK (((nota >= 1) AND (nota <= 5)))
);

ALTER TABLE public.avaliacoes OWNER TO render_bd_v2_user;

--
-- Name: avaliacoes_id_seq; Type: SEQUENCE; Schema: public; Owner: render_bd_v2_user
--

CREATE SEQUENCE public.avaliacoes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE public.avaliacoes_id_seq OWNER TO render_bd_v2_user;

--
-- Name: avaliacoes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: render_bd_v2_user
--

ALTER SEQUENCE public.avaliacoes_id_seq OWNED BY public.avaliacoes.id;

--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: render_bd_v2_user
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nome character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    senhahash character varying(250) NOT NULL,
    prestador boolean DEFAULT false,
    especialidade character varying(100),
    avaliacao character varying(10),
    descricao character varying(500),
    foto text,
    cidade character varying(100),
    linkedin text,
    instagram text,
    facebook text
);

ALTER TABLE public.usuarios OWNER TO render_bd_v2_user;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: render_bd_v2_user
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE public.usuarios_id_seq OWNER TO render_bd_v2_user;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: render_bd_v2_user
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;

--
-- Name: avaliacoes id; Type: DEFAULT; Schema: public; Owner: render_bd_v2_user
--

ALTER TABLE ONLY public.avaliacoes ALTER COLUMN id SET DEFAULT nextval('public.avaliacoes_id_seq'::regclass);

--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: render_bd_v2_user
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);

--
-- Data for Name: avaliacoes; Type: TABLE DATA; Schema: public; Owner: render_bd_v2_user
--

COPY public.avaliacoes (id, usuario_id, nome_avaliador, nota, comentario, data) FROM stdin;
1	20	123	5	1	2025-10-26 15:26:16.177108
2	20	123	3	teste	2025-10-26 15:26:27.520564
3	20	123	4		2025-10-26 15:34:15.424551
4	20	123	5		2025-10-26 15:40:55.206602
5	20	123	5		2025-10-26 15:43:29.192937
6	20	123	1		2025-10-26 15:43:36.76917
7	20	123	3		2025-10-26 15:44:00.973471
8	20	123	5		2025-10-26 16:42:32.822527
9	20	123	3		2025-10-26 16:42:41.009695
10	20	123	4		2025-10-26 16:42:59.746401
11	20	123	5		2025-10-26 16:43:16.418943
12	19	123	5		2025-10-26 16:44:18.18229
13	19	123	4		2025-10-26 16:44:23.213847
14	20	123	5		2025-10-26 16:46:29.54403
15	20	123	4		2025-10-26 16:46:33.731374
16	20	123	5		2025-10-26 16:47:07.871048
17	19	123	5		2025-10-26 16:56:07.161083
18	19	123	2		2025-10-26 16:56:47.355619
19	20	123	5		2025-10-26 17:21:22.851322
20	15	123	5		2025-10-26 17:21:34.598587
21	15	123	4		2025-10-26 17:21:40.101896
22	18	123	5		2025-10-26 17:28:42.739045
23	20	123	5		2025-10-26 17:34:53.171572
24	20	Carlos Pintor	1		2025-10-26 17:42:20.128662
25	20	Carlos Pintor	5		2025-10-26 17:43:57.566975
26	15	Carlos Pintor	5	├│timo trabalho	2025-10-26 21:48:31.34996
\.

--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: render_bd_v2_user
--

COPY public.usuarios (id, nome, email, senhahash, prestador, especialidade, avaliacao, descricao, foto, cidade, linkedin, instagram, facebook) FROM stdin;
1	teste	teste@admin.com	123	f	\N	\N	\N	\N	\N	\N	\N	\N
2	teste2	teste2@admin.com	123	t	eletricista	\N	\N	\N	\N	\N	\N	\N
3	teste3	teste2@admin	123	f		\N	\N	\N	\N	\N	\N	\N
17	admin teste	teste@admin	123	f		\N	\N	\N	\N	\N	\N	\N
19	joao pereira	123@gmail.com	123	t	Eletricista	\N	\N	\N	Porto Alegre	\N	\N	\N
16	123	123@123	123	f	eletricista	\N	aaa		S├úo Leopoldo			
18	AAAA	123@1234	1234	t	eletricista	5.0	\N	\N	\N	\N	\N	\N
20	Carlos Pintor	carlos@pintor	123	t	pintor	4.1	testeee		Porto Alegre	https://www.linkedin.com/in/vinicius-deitos/	https://www.linkedin.com/in/vinicius-deitos/	https://www.linkedin.com/in/vinicius-deitos/
15	Vinicius Deitos	viniciusdeitos@gmail.com	123	t	eletricista	4.7	\N	\N	\N	\N	\N	\N
21	Camila	camila@lcl.com	cl1foi	t	Jardineiro	\N	\N	\N	gravata├¡	\N	\N	\N
22	Osvaldo Trentin	teste@4	123	t	Pintor	\N			Novo Hamburgo			
\.

--
-- Name: avaliacoes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: render_bd_v2_user
--

SELECT pg_catalog.setval('public.avaliacoes_id_seq', 26, true);

--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: render_bd_v2_user
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 22, true);

--
-- Name: avaliacoes avaliacoes_pkey; Type: CONSTRAINT; Schema: public; Owner: render_bd_v2_user
--

ALTER TABLE ONLY public.avaliacoes
    ADD CONSTRAINT avaliacoes_pkey PRIMARY KEY (id);

--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: render_bd_v2_user
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);

--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: render_bd_v2_user
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);

--
-- Name: avaliacoes avaliacoes_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: render_bd_v2_user
--

ALTER TABLE ONLY public.avaliacoes
    ADD CONSTRAINT avaliacoes_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;

--
-- PostgreSQL database dump complete
--

\unrestrict pSWWCarc3ynu0TRNJK2HDIdDGXgdleXbhFvb1apFBUEn73kY82LHOMj0GTaHLBq
