# Uninstall Guide

This guide covers how to remove Outlook for Linux from your system, including the application itself, package repositories, and user data.

:::tip
The uninstall steps depend on how you originally installed the application. If you're unsure, check your package manager's installed packages list.
:::

## Package Repository Installations

### Debian/Ubuntu (apt)

```bash
# Remove the application, its configuration, and any orphaned dependencies
sudo apt purge --autoremove outlook-for-linux

# Remove the repository source
sudo rm /etc/apt/sources.list.d/outlook-for-linux-packages.sources

# Remove the signing key
sudo rm /etc/apt/keyrings/outlook-for-linux.asc

# Update package lists
sudo apt update
```

### RHEL/Fedora/CentOS (dnf/rpm)

```bash
# Remove the application
sudo dnf remove outlook-for-linux

# Clean up orphaned dependencies
sudo dnf autoremove

# Remove the repository configuration
sudo rm /etc/yum.repos.d/outlook-for-linux.repo
```

## Distribution-Specific Packages

### Arch Linux (AUR)

```bash
# Using yay
yay -Rs outlook-for-linux

# Using paru
paru -Rs outlook-for-linux

# Using pacman directly
sudo pacman -Rs outlook-for-linux
```

### Ubuntu (Pacstall)

```bash
pacstall -R outlook-for-linux-deb
```

### Vylen Linux

```bash
sudo emerald purge outlook-for-linux
```

### Snap

```bash
sudo snap remove --purge outlook-for-linux
```

### Flatpak

```bash
flatpak uninstall --delete-data com.github.IsmaelMartinez.teams_for_linux
```

## Manual Installations

### Debian/Ubuntu (.deb installed via dpkg)

```bash
sudo dpkg -P outlook-for-linux
```

### Red Hat/Fedora (.rpm installed via rpm)

```bash
sudo rpm -e outlook-for-linux
```

### AppImage

AppImage files are standalone executables with no system-level installation. Delete the AppImage file you downloaded:

```bash
rm outlook-for-linux_*.AppImage
```

If you used [AppImageLauncher](https://github.com/TheAssassin/AppImageLauncher), also remove the desktop integration it created.

### Portable Installation (tar.gz)

Delete the extracted directory:

```bash
rm -rf outlook-for-linux/
```

## Removing User Data

Uninstalling the application does not remove your user data and configuration. To perform a complete removal, delete the configuration directory for your installation type:

| Installation type | Configuration directory |
|-------------------|----------------------|
| Standard installations (deb, rpm, AUR, etc.) | `~/.config/outlook-for-linux` |
| Snap | `~/snap/outlook-for-linux/current/.config/outlook-for-linux/` |
| Flatpak (user install) | `~/.var/app/com.github.IsmaelMartinez.teams_for_linux/config/outlook-for-linux` |
| From source | `~/.config/Electron/` |

:::warning
Removing user data deletes your cached login sessions, configuration, and any local application data. This action cannot be undone.
:::

## Related Documentation

- [Installation Guide](installation.md) — Install Outlook for Linux
- [Configuration](configuration.md) — Configuration reference
- [Troubleshooting](troubleshooting.md) — Common issues and solutions
