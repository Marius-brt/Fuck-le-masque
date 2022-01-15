-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : sam. 15 jan. 2022 à 23:44
-- Version du serveur : 10.4.21-MariaDB
-- Version de PHP : 8.0.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `fuck_le_masque`
--

-- --------------------------------------------------------

--
-- Structure de la table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `description` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `events`
--

INSERT INTO `events` (`id`, `date`, `description`) VALUES
(1, '2021-05-31', 'Vaccination ouverte à l\'ensemble de la population de plus de 18 ans.'),
(2, '2021-01-18', 'Personnes âgées de plus de 75 ans en priorité, puis personnes âgées de plus de 65 ans dans un second temps.'),
(3, '2021-02-06', 'Les professionnels de la Santé, du secteur médico-social, les aides à domicile et les sapeurs-pompiers quel que soit leur âge pourront se faire vacciner.'),
(4, '2021-02-19', 'Personnes de plus de 50 ans atteintes de comorbidité(s) pourront se faire vacciner.'),
(5, '2021-03-27', 'Les personnes âgées de plus de 70 ans et les personnes à risque de plus de 50 ans pourront désormais se faire vacciner.'),
(6, '2021-04-08', 'Les femmes enceintes auront accès à la vaccination.'),
(7, '2021-04-12', 'Les personnes âgées de plus de 55 ans pourront se faire vacciner.'),
(8, '2021-05-01', 'Les personnes à risque de plus de 18 ans auront accès à la vaccination.'),
(9, '2021-05-10', 'Les personnes âgées de plus de 50 ans pourront avoir accès à la vaccination.'),
(10, '2021-05-12', 'L\'ensemble de la population de plus de 18 ans pourra se faire vacciner uniquement si il-y-a un créneau libre pour le lendemain.'),
(11, '2021-06-15', 'Vaccination ouverte aux adolescents de 12 à 18 ans.'),
(12, '2022-01-15', 'Toute personne de plus de 18 ans devra recevoir une troisième dose pour conserver son passe sanitaire.'),
(13, '2021-12-15', 'Vaccination ouverte aux enfants de 5 à 11 ans.');

-- --------------------------------------------------------

--
-- Structure de la table `vaccin`
--

CREATE TABLE `vaccin` (
  `id` int(11) NOT NULL,
  `date` varchar(10) NOT NULL,
  `third_dose` int(11) NOT NULL,
  `new_third_dose` int(11) NOT NULL,
  `first_dose` int(11) NOT NULL,
  `new_first_dose` int(11) NOT NULL,
  `second_dose` int(11) NOT NULL,
  `new_second_dose` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `vaccin`
--
ALTER TABLE `vaccin`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `vaccin`
--
ALTER TABLE `vaccin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
