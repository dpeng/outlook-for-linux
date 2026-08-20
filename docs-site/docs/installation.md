# Installation Guide

Multiple installation methods are available for Outlook for Linux across different Linux distributions.

:::info About Outlook for Linux
**Unofficial Microsoft Outlook client for Linux** — a native desktop app that wraps Outlook Web with enhanced Linux integration including system notifications, tray integration, system notifications, tray integration, and persistent session storage.
:::

## Quick Installation

### Package Repositories (Recommended)

We maintain dedicated deb and rpm repositories hosted with ❤️ by [Nils Büchner](https://github.com/nbuechner).

#### Debian/Ubuntu

```bash
sudo mkdir -p /etc/apt/keyrings
sudo wget -qO /etc/apt/keyrings/outlook-for-linux.asc https://repo.teamsforlinux.de/outlook-for-linux.asc
sh -c 'echo "Types: deb
URIs: https://repo.teamsforlinux.de/debian/
Suites: stable
Components: main
Signed-By: /etc/apt/keyrings/outlook-for-linux.asc
Architectures: amd64" | sudo tee /etc/apt/sources.list.d/outlook-for-linux-packages.sources'
sudo apt update && sudo apt install outlook-for-linux
```

#### RHEL/Fedora/CentOS

```bash
curl -1sLf -o /tmp/outlook-for-linux.asc https://repo.teamsforlinux.de/outlook-for-linux.asc
sudo rpm --import /tmp/outlook-for-linux.asc
sudo curl -1sLf -o /etc/yum.repos.d/outlook-for-linux.repo https://repo.teamsforlinux.de/rpm/outlook-for-linux.repo
sudo dnf install outlook-for-linux
```

#### Beta Channel (Pre-releases)

New versions are published to a `beta` channel first and promoted to `stable` after a few days of testing. Follow the beta channel if you want pre-releases and want to help test them before promotion.

**Debian/Ubuntu** — same source as stable, with `Suites: beta`:

```bash
sudo mkdir -p /etc/apt/keyrings
sudo wget -qO /etc/apt/keyrings/outlook-for-linux.asc https://repo.teamsforlinux.de/outlook-for-linux.asc
sh -c 'echo "Types: deb
URIs: https://repo.teamsforlinux.de/debian/
Suites: beta
Components: main
Signed-By: /etc/apt/keyrings/outlook-for-linux.asc
Architectures: amd64" | sudo tee /etc/apt/sources.list.d/outlook-for-linux-packages.sources'
sudo apt update && sudo apt install outlook-for-linux
```

**RHEL/Fedora/CentOS** — use the beta repository:

```bash
curl -1sLf -o /tmp/outlook-for-linux.asc https://repo.teamsforlinux.de/outlook-for-linux.asc
sudo rpm --import /tmp/outlook-for-linux.asc
sudo curl -1sLf -o /etc/yum.repos.d/outlook-for-linux-beta.repo https://repo.teamsforlinux.de/rpm-beta/outlook-for-linux-beta.repo
sudo dnf install outlook-for-linux
```

To return to stable releases, change `Suites: beta` back to `Suites: stable` (Debian/Ubuntu), or remove `/etc/yum.repos.d/outlook-for-linux-beta.repo` and reinstall from the stable repository (RHEL/Fedora/CentOS).

## Distribution-Specific Packages

### Arch Linux (AUR)

```bash
# Using yay
yay -S outlook-for-linux

# Using paru
paru -S outlook-for-linux

# Manual AUR build
git clone https://aur.archlinux.org/outlook-for-linux.git
cd outlook-for-linux
makepkg -si
```

[![AUR: outlook-for-linux](https://img.shields.io/badge/AUR-teams--for--linux-blue.svg)](https://aur.archlinux.org/packages/outlook-for-linux)

### Ubuntu (Pacstall)

```bash
# Install Pacstall first (if not already installed)
sudo bash -c "$(curl -fsSL https://pacstall.dev/q/install)"

# Install Outlook for Linux
pacstall -I outlook-for-linux-deb
```

[![Pacstall: outlook-for-linux-deb](https://img.shields.io/badge/Pacstall-teams--for--linux--deb-00958C)](https://github.com/pacstall/pacstall-programs/tree/master/packages/outlook-for-linux-deb)

### Vylen Linux

```bash
sudo emerald install outlook-for-linux
```

[![Vylen Linux: outlook-for-linux](https://img.shields.io/badge/Vylen_Linux-teams--for--linux-green)](https://vylen.gitlab.io/packages/#outlook-for-linux)

### Snap Store

```bash
sudo snap install outlook-for-linux
```

:::tip Update Frequency
Flatpak is the slowest update channel — it only receives a new version after the release has reached 100% across all other channels. Snap stable is the next slowest, with manual promotion after testing. If you prefer fewer update notifications, these are good choices. See the [Release Cadence](development/manual-release-process.md#release-cadence) section for details.
:::

[![Get it from the Snap Store](https://snapcraft.io/static/images/badges/en/snap-store-black.svg)](https://snapcraft.io/outlook-for-linux)

### Flathub

```bash
flatpak install flathub com.github.IsmaelMartinez.teams_for_linux
```

<a href='https://flathub.org/apps/details/com.github.IsmaelMartinez.teams_for_linux'><img width='170' alt='Download on Flathub' src='https://flathub.org/assets/badges/flathub-badge-en.png'/></a>

#### Flathub Beta Channel (Pre-releases)

Pre-releases are published to the Flathub beta remote before they reach the stable Flathub build. Following the beta remote is the most useful thing a Flatpak user can do for this project, because sandbox and permission changes can be built by the Flathub buildbot but cannot be tested by the maintainer, who has no Linux desktop available.

```bash
flatpak remote-add --if-not-exists flathub-beta https://flathub.org/beta-repo/flathub-beta.flatpakrepo
flatpak install flathub-beta com.github.IsmaelMartinez.teams_for_linux//beta
```

The beta build is a separate branch of the same application ID, so it installs alongside the stable one rather than replacing it. That matters when you launch it: the desktop launcher and a bare `flatpak run com.github.IsmaelMartinez.teams_for_linux` both keep starting the stable build, so run the beta explicitly, otherwise you will think you are testing the pre-release when you are not.

```bash
flatpak run com.github.IsmaelMartinez.teams_for_linux//beta
```

To go back to stable, remove the beta branch:

```bash
flatpak uninstall com.github.IsmaelMartinez.teams_for_linux//beta
```

If the install fails with the app not being found on `flathub-beta`, there is no beta build published at the moment. The beta remote only carries a build while a pre-release is being tested, so use the stable Flathub install above and try again after the next release.

:::note
The beta remote carries pre-release builds and packaging changes that are still being validated, so expect the occasional rough edge. If you hit one, please [open an issue](https://github.com/IsmaelMartinez/teams-for-linux/issues) and mention that you are on the beta remote.
:::

## Manual Installation

### Download from GitHub Releases

1. Go to [GitHub Releases](https://github.com/IsmaelMartinez/outlook-for-linux/releases)
2. Download the appropriate package for your system:
   - **AppImage** - Universal Linux package
   - **deb** - Debian/Ubuntu package
   - **rpm** - Red Hat/Fedora package
   - **snap** - Universal snap package
   - **tar.gz** - Portable archive

### Package Installation

#### Debian/Ubuntu (.deb)

```bash
sudo dpkg -i outlook-for-linux_*.deb
sudo apt-get install -f  # Fix dependencies if needed
```

#### Red Hat/Fedora (.rpm)

```bash
# Fedora
sudo dnf install outlook-for-linux_*.rpm

# RHEL/CentOS
sudo rpm -i outlook-for-linux_*.rpm
```

#### AppImage

```bash
# Make executable
chmod +x outlook-for-linux_*.AppImage

# Run directly
./outlook-for-linux_*.AppImage

# For better desktop integration, use AppImageLauncher
```

:::tip AppImage Integration
For AppImage files, install [`AppImageLauncher`](https://github.com/TheAssassin/AppImageLauncher) for better desktop integration, including automatic menu entries and file associations.
:::

#### Portable Installation (tar.gz)

```bash
# Extract
tar -xzf outlook-for-linux_*.tar.gz

# Run
cd outlook-for-linux/
./outlook-for-linux
```

## First Launch

### Quick Start

1. **Launch** the application:
   ```bash
   outlook-for-linux
   ```

2. **Sign in** with your Microsoft Teams account

3. **Configure** if needed by creating `~/.config/outlook-for-linux/config.json`

### Initial Configuration

For basic usage, no configuration is required. Outlook for Linux will work out of the box.

For advanced features, create a configuration file:

```bash
mkdir -p ~/.config/outlook-for-linux/
```

Example basic configuration:
```json
{
  "minimizeToTray": true,
  "startInTray": false,
  "enableDesktopNotifications": true
}
```

See the [Configuration Guide](configuration.md) for all available options.

## Command Line Options

### Basic Usage

```bash
# Standard launch
outlook-for-linux

# Use custom config directory
outlook-for-linux --user-data-dir=/path/to/custom/profile
```

### Multiple Instances

```bash
# Work profile
outlook-for-linux --user-data-dir=~/.config/teams-work --class=teams-work

# Personal profile  
outlook-for-linux --user-data-dir=~/.config/teams-personal --class=teams-personal
```

See [Multiple Instances](multiple-instances.md) for detailed setup.

### Debug Mode

```bash
# Enable debug logging
outlook-for-linux --logConfig='{"level":"debug"}'

# Show developer tools with Electron logging
ELECTRON_ENABLE_LOGGING=true outlook-for-linux
```

## Troubleshooting Installation

### Common Issues

#### Package Dependencies

```bash
# Ubuntu/Debian - fix missing dependencies
sudo apt-get install -f

# Fedora - install missing packages
sudo dnf install missing-package-name
```

#### Audio Not Working

```bash
# Check PulseAudio status
pulseaudio --check

# Restart PulseAudio
pulseaudio --kill && pulseaudio --start
```

#### Permission Issues

```bash
# Add user to audio group
sudo usermod -a -G audio $USER

# Add user to video group (for webcam)
sudo usermod -a -G video $USER

# Log out and back in for changes to take effect
```

### Repository Issues

#### GPG Key Problems

```bash
# Re-import repository key
curl -1sLf -o /tmp/outlook-for-linux.asc https://repo.teamsforlinux.de/outlook-for-linux.asc
sudo rpm --import /tmp/outlook-for-linux.asc  # For RPM systems
```

#### Network/Proxy Issues

```bash
# For corporate environments with proxies
export https_proxy=http://proxy.company.com:8080
```

## Next Steps

After installation:

1. **[Configuration](configuration.md)** - Customize Outlook for Linux settings
2. **[Multiple Instances](multiple-instances.md)** - Set up work and personal profiles
3. **[Screen Sharing](screen-sharing.md)** - Configure screen capture
4. **[Troubleshooting](troubleshooting.md)** - Common issues and solutions
5. **[Uninstall Guide](uninstall.md)** - Remove Outlook for Linux from your system

## Support

- **Documentation**: [Full documentation](index.md)
- **Issues**: [GitHub Issues](https://github.com/IsmaelMartinez/outlook-for-linux/issues)
- **Community**: [Matrix Space](https://matrix.to/#/#outlook-for-linux-space:matrix.org)
- **Discussions**: [GitHub Discussions](https://github.com/IsmaelMartinez/outlook-for-linux/discussions)

## Related Documentation

- [Configuration Options](configuration.md) - Complete configuration reference
- [Multiple Instances](multiple-instances.md) - Running multiple profiles
- [Troubleshooting](troubleshooting.md) - Common issues and solutions
