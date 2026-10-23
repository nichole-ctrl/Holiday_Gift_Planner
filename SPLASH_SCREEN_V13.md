# Branded PWA startup experience (v13)

- Android: manifest background and theme color set to warm cream; native launch screen is OS-generated using the app icon.
- iPhone: portrait startup images for common display sizes are linked from the paid app HTML. iOS support varies; unsupported sizes fall back to an OS-generated launch screen. Existing installations may need removal and re-addition to refresh the native launch screen.
- Installed PWA: a brief branded HTML splash bridges into the app; it is not displayed for ordinary browser visits. It does not replace or hide the authentication workflow.
- Demo: remains separate and does not acquire access to paid accounts.
- Test on real iPhone and Android hardware; the exact native splash appearance is OS-dependent.
