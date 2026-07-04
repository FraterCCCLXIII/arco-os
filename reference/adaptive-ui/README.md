# Adaptive UI layout references

Material 3 Adaptive Compose libraries and official sample apps for studying list–detail, supporting-pane, and navigation-suite patterns across window size classes and fold postures.

These directories are **not** vendored dependencies — they stay out of the product build.

## Library source (AndroidX)

Sparse clone of [androidx/androidx](https://github.com/androidx/androidx) — only the adaptive Compose modules.

| Maven artifact | Kotlin package | Path in `androidx-adaptive/` |
|----------------|----------------|------------------------------|
| `androidx.compose.material3.adaptive:adaptive` | `androidx.compose.material3.adaptive` | [`compose/material3/adaptive/adaptive/`](androidx-adaptive/compose/material3/adaptive/adaptive/) |
| `androidx.compose.material3.adaptive:adaptive-layout` | `androidx.compose.material3.adaptive.layout` | [`compose/material3/adaptive/adaptive-layout/`](androidx-adaptive/compose/material3/adaptive/adaptive-layout/) |
| `androidx.compose.material3.adaptive:adaptive-navigation` | `androidx.compose.material3.adaptive.navigation` | [`compose/material3/adaptive/adaptive-navigation/`](androidx-adaptive/compose/material3/adaptive/adaptive-navigation/) |

Also included:

| Artifact | Path |
|----------|------|
| `material3-adaptive-navigation-suite` (`NavigationSuiteScaffold`) | [`compose/material3/material3-adaptive-navigation-suite/`](androidx-adaptive/compose/material3/material3-adaptive-navigation-suite/) |
| In-repo adaptive samples | [`compose/material3/adaptive/samples/`](androidx-adaptive/compose/material3/adaptive/samples/) |

**Docs:** [Compose Material 3 Adaptive releases](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive) · [Adaptive apps guides](https://developer.android.com/develop/adaptive-apps)

## Sample apps

Full shallow clone of [android/adaptive-apps-samples](https://github.com/android/adaptive-apps-samples).

| Sample | What it demonstrates |
|--------|----------------------|
| [`CanonicalLayouts/`](adaptive-apps-samples/CanonicalLayouts/) | List–detail, supporting pane, feed layouts |
| [`AdaptiveNavigationSample/`](adaptive-apps-samples/AdaptiveNavigationSample/) | `NavigationSuiteScaffold` (bar / rail / drawer) |
| [`AdaptiveJetStream/`](adaptive-apps-samples/AdaptiveJetStream/) | End-to-end adaptive media app |
| [`FlexBox/`](adaptive-apps-samples/FlexBox/) · [`Grid/`](adaptive-apps-samples/Grid/) · [`MediaQuery/`](adaptive-apps-samples/MediaQuery/) | Responsive layout primitives |

## Refresh

```bash
# Library source (sparse androidx clone)
cd adaptive-ui/androidx-adaptive && git pull

# Sample apps
cd adaptive-ui/adaptive-apps-samples && git pull
```

## Re-clone from scratch

```bash
cd reference/adaptive-ui

# Sparse AndroidX checkout (source only — not buildable standalone)
git clone --depth 1 --filter=blob:none --sparse https://github.com/androidx/androidx.git androidx-adaptive
cd androidx-adaptive
git sparse-checkout set compose/material3/adaptive compose/material3/material3-adaptive-navigation-suite
cd ..

# Official adaptive sample apps
git clone --depth 1 https://github.com/android/adaptive-apps-samples.git adaptive-apps-samples
```
