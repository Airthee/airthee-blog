---
title: '[FR] Partagez une connexion Speedify grâce à votre Raspberry Pi'
date: '2020-09-20'
lang: 'fr_FR'
---

# Mise en place de Speedify sur un Raspberry Pi

Cet article décrit la procédure à réaliser afin de partager une connexion Speedify depuis un Raspberry Pi.

A la fin de cette procédure, vous disposerez d'un point d'accès (AP) et la connexion à cet AP permettra
d'utiliser le réseau Speedify avec tous ces avantages, peu importe le nombre d'appareils à connectés.

## Prérequis

* Avoir au moins deux interfaces réseau : l'interface permettant aux autres appareils de se connecter ne peut être utlisée par le Raspberry pour accéder à internet. Si votre Raspberry est assez récent, il dispose déjà d'une antenne Wifi intégrée, et de ports ethernet, mais si vous souhaitez aggréger plusieurs réseaux wifi, vous devrez investir dans une (ou plusieurs) clé(s) Wifi USB.
* Avoir un compte [Speedify](https://speedify.com/).

## Procédure

### Etape 1 : Configuration de Speedify sur Raspberry

Speedify fournit un script d'installation :

```bash
wget -qO- https://get.speedify.com | bash -
```

Une fois le script terminé, tous les composants Speedify ont été installés, vous pouvez alors vous connecter avec vos identifiants Speedify:

```bash
/usr/share/speedify/speedify_cli login {username} {password}
```

Pour avoir accès à la commande `speedify_cli` depuis n'importe où, vous pouvez créer un lien symbolique pointant vers l'exécutable (le répertoire `/usr/local/bin` doit bien évidemment faire partie de votre `$PATH`) :

```bash
sudo ln -s /usr/share/speedify/speedify_cli /usr/local/bin/speedify_cli
```

Le client Speedify est maintenant correctement configuré, vous pouvez tester la connexion avec la commande :

```bash
speedify_cli connect closest
```

### Etape 2 : Configuration du partage Speedify

Modifier le fichier `/etc/speedify/speedify.conf` :

```conf
ENABLE_SHARE=1
SHARE_INTERFACE="wlan0"
```

Le paramètre `SHARE_INTERFACE` est l'interface sur laquelle les autres appareils se connecteront pour accéder à internet.
Dans mon cas, je souhaite créer un point d'accès wifi, il faut donc que les autres appareils se connectent sur une interface wifi.

Un peu plus bas dans le fichier, nous avons la configuration du point d'accès :

```conf
# Wi-Fi hotspot settings
# To use Wi-Fi sharing, set the WIFI_INTERFACE to the same as the SHARE_INTERFACE above
WIFI_INTERFACE="wlan0"
WIFI_SSID="SpeedifyAP"
WIFI_PASSWORD="[PASS]"
```

Bien sûr, libre à vous de choisir le mot de passe wifi.

Une fois le fichie de configuration édité, redémarrer le service `speedify-sharing` :

```bash
sudo service speedify-sharing restart
```

### Etape 3 : Configurer les sources pour speedify

Cette étape dépend entièrement de votre configuration. Dans mon cas, j'ai **deux box internet** (une box 4G et une box ADSL) et je souhaite aggréger ces deux connexions.
J'ai donc décidé de connecter mon Raspberry à la **box A par câble Ethernet**, et par **Wifi à la box B** grâce à une clé Wifi USB.

Pour vérifier que toutes vos interfaces ont bien une adresse IP qui leur est assignée, lancer la commande :

```bash
ifconfig
```

Cette commande liste les interfaces actives et les adresses IP.

Pour se connecter à un réseau par le SSID :

```bash
sudo iwconfig wlanXXX essid "[NOM DU RESEAU]"
```

### Etape 4 : Redémarrer le Raspberry

C'est l'heure de redémarrer le Raspberry.
Une fois redémarré, vous verrez, sur vos autres appareils, un nouveau point d'accès.
Il ne vous reste plus qu'à vous connecter comme à un réseau normal !
