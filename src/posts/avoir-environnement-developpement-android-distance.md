---
title: "[FR] Avoir un environnement de développement Android à distance"
date: "2021-11-11"
lang: "fr_FR"
---

# Avoir un environnement de développement Android à distance

## Pour quoi faire ?

Aujourd'hui, la puissance des postes de développements et la connexion à internet n'est plus un frein pour développer sur Android. Alors pourquoi avoir besoin d'un environnement de développement à distance ?

Pour ma part, et peut-être aussi pour d'autres, je ne dispose pas d'une connexion internet satisfaisante. En effet, étant dans une zone peu desservie, ma bande passante n'excède pas les 500ko/s...

Au vu de la taille des téléchargements nécessaire pour la mise en place d'une environnement de développement Android (JDK, Android Studio, ...), j'ai préféré chercher une solution plus intéressante pour ma situation.

## En quoi ça consiste ?

La solution consiste à installer l'environnement de développement sur une machine à distance, qui elle, dispose d'une bonne connexion à internet.  
Celà permet de télécharger les outils et packets à des vitesses formidablement plus élevées que votre connexion personnelle.

## Mise en place de la solution

### Prérequis

Pour pouvoir mettre en place la solution, vous devez disposer de :

- Une machine à distance : pour ma part, j'utilise une instance DEV1-S chez [Scaleway](scaleway.com).
- Un IDE sur votre poste local : dans cet exemple, j'utilise [VSCode](https://code.visualstudio.com/).
- Un compte [Ngrok](ngrok.com)

C'est tout, vous êtes fin prêts !

### C'est partit !

#### Installation d'OpenJDK

Dans le cadre d'une développement Android, vous devez installer sur la machine à distance l'outil de développement d'Android...

##### Installer depuis les sources

Installer depuis les sources permet de garder la main sur l'installation mais aussi d'obtenir la dernière version (contrairement au gestionnaire de paquets qui peut ne pas être à jour).

Aller sur [le site officiel du JDK](https://jdk.java.net/), depuis lequel vous pouvez récupérer la dernière version du JDK.

Depuis votre machine distante, télécharger et extraire le JDK dans le répertoire `/opt` :

```bash
cd /opt
wget https://download.java.net/java/GA/jdk17.0.1/2a2082e5a09d4267845be086888add4f/12/GPL/openjdk-17.0.1_linux-x64_bin.tar.gz
tar -xcf openjdk-17.0.1_linux-x64_bin.tar.gz
rm openjdk-17.0.1_linux-x64_bin.tar.gz
```

Le répertoire du JDK est alors créé dans le repertoire `/opt/jdk-17.0.1`, cependant, il faut que votre système connaisse le chemain du JDK.  
Pour celà, il suffit de déclarer la variable d'environnement `JAVA_HOME` :

```bash
echo "export JAVA_HOME=/opt/jdk-17.0.1" >> ~/.bashrc
```

### Installation d'Android Studio

Vous vous en doutez sûrement, développer sous Android nécessite obligatoirement d'avoir Android Studio sur sa machine.  
Il faut donc, installer Android Studio sur votre machine distante.

Nous aurions pu utiliser encore une fois Snap pour installer Android Studio. Cependant, je propose ici d'installer la version CLI, étant donné que nous n'avons pas d'interface graphique sur notre machine distante.

Je vous invite donc à télécharger la version CLI d'Android Studio depuis le site d'Android, dans la section ["Command line tools only"](https://developer.android.com/studio#command-tools) en sélectionnant la version pour Linux.

Une fois les conditions acceptées, copiez le lien de téléchargement.

Premièrement, nous allons nous placer dans le repertoire dans lequel nous vouons installer Android Studio.  
Pour ma part, j'ai décidé de l'installer dans le répertoire du JDK :

```bash
cd $JAVA_HOME
mkdir cmdline-tools
cd cmdline-tools
wget commandlinetools-linux-7583922_latest.zip
unzip commandlinetools-linux-7583922_latest.zip
rm commandlinetools-linux-7583922_latest.zip
mv cmdline-tools latest
```

C'est dans ce repertoire que se trouvent les outils d'Android Studio.

Pour avoir accès aux lignes de commande depuis n'importe quel répertoire, ajouter le répertoire suivant à votre PATH :

```bash
echo "export PATH=$PATH:$JAVA_HOME/cmdline-tools/latest/bin" >> ~/.bashrc
source ~/.bashrc
```

Pour vérifier que les tools sont bien dans votre PATH, vérifier la version du `sdkmanager` :

```bash
sdkmanager --version
```

Si la version est bien renvoyée, alors votre JDK est bien installé !

### Installation des SDK d'Android

Afin de pouvoir développer et compiler pour Android, il faut installer les packets suivants (selon la plateforme Android que vous ciblez) :

```bash
sdkmanager --install "platforms;android-30" "system-images;android-30;default;x86_64" "platform-tools" "build-tools;31.0.0"
```

Accepter les licenses lorsqu'elles sont demandées.

Rajouter la variable d'environnement `ANDROID_SDK_ROOT` :

```bash
export ANDROID_SDK_ROOT=$JAVA_HOME/platforms
```

### Connecter ADB à votre Android

Pour connecter votre machine distance à votre appareil Android, il faut dans un premier temps avoir `adb` d'installé sur votre machine locale.

Brancher votre appareil en USB et lister les appareils disponibles grâce à ADB :

```bash
adb devices
```

Votre appareil devrait être affiché.

Récupérer l'address IP de votre appareil Android (celui-ci doit être sur le même réseau que votre machine locale).

Une fois l'address récupérée, lancer la commande suivante pour utiliser ADB à travers le réseau :

```bash
adb tcpip 5555
adb connect [ADDRESS_IP_DEVICE]:5555
```

En relancant la commande `adb devices`, nous devrions voir quelque chose comme ça :

```txt
List of devices attached
[ADDRESS_IP_DEVICE]:5555	device
```

Créer un tunnel TCP grâce à l'outil Ngrok (vous devez être connecté grâce à la commande `ngrok authtoken`, voir [l'aide](https://dashboard.ngrok.com/get-started/setup)) :

```bash
ngrok tcp [ADDRESS_IP_DEVICE]:5555
```

Vous devriez voir le statut "online" dans l'interface d'Ngrok ainsi que l'url de forwarding.

Maintenant, retourner sur le serveur, et connectez-vous au tunnel Ngrok avec ADB :

```bash
# Y -> numéro aléatoire donné par Ngrok
# XXXXX -> port donné par Ngrok
adb connect Y.tcp.ngrok.io:XXXXX
```

## Initialisation du projet

### React Native

Ouvrir votre IDE, et installer l'extension [Remote - SSH](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh).

Ajouter votre machine distante aux liste des hosts : `Ctrl+Shift+P` > `add new ssh host` et suivre les instruction pour ajouter votre serveur.

Une fois ajouté, se connecter au serveur : `Ctrl+Shift+P` > `connect to host` et sélectionner le serveur précédemment ajouté.

Une fois connecté, initialiser les projet d'exemple de React Native :

```bash
npx react-native init AwesomeProject
```

Vous pouvez maintenant lancer votre projet !

### Flutter

Flutter nous met à disposition un outil très pratique : `flutter doctor`.

Je vous invite donc à lancer la commande `flutter doctor` afin de voir les configurations à ajuster.

Il vous faudra configurer au niveau de flutter le chemin vers le SDK d'Android :

```bash
flutter config --android-sdk=$JAVA_HOME
```

Vous pouvez aussi désactiver la fonction web de flutter :

```bash
flutter config --no-enable-web
```

Vous êtes maintenant prêt à développer votre projet !
