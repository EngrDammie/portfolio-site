// GENERATED FILE - DO NOT EDIT BY HAND.
// Produced by scripts/build-adapters.mjs from tokens.json.
// Edit tokens.json, then run: npm run tokens:build
// Checked for staleness by: npm run adapters:check
//
// Source of truth: tokens.json
//
// API notes, verified 30 September 2026:
//   * ThemeData.cardTheme is CardThemeData, not CardTheme, as of Flutter 3.32.
//   * ColorScheme.background and ColorScheme.surfaceVariant were REMOVED in
//     Flutter 3.22. The replacements are the surfaceContainer* family and
//     scaffoldBackgroundColor, both set below.
//   * Scaffold background is set explicitly because ThemeData otherwise
//     derives it, and this brand has a specific page colour.
//   * textScaler is deliberately never set. Flutter scales text from the
//     user's accessibility settings, and pinning it makes the app
//     unusable for someone who needs larger text.

import 'package:flutter/material.dart';

/// Raw palette. Referenced only by [BrandColors]. No widget should use this.
abstract final class BrandPalette {
  static const Color amber400 = Color(0xFFFBBF24);
  static const Color amber500 = Color(0xFFF59E0B);
  static const Color amber700 = Color(0xFFB45309);
  static const Color cyan400 = Color(0xFF22D3EE);
  static const Color cyan500 = Color(0xFF06B6D4);
  static const Color cyan700 = Color(0xFF0E7490);
  static const Color emerald400 = Color(0xFF34D399);
  static const Color emerald500 = Color(0xFF10B981);
  static const Color emerald700 = Color(0xFF047857);
  static const Color paper = Color(0xFFEAEFF5);
  static const Color rose400 = Color(0xFFFB7185);
  static const Color rose500 = Color(0xFFF43F5E);
  static const Color rose700 = Color(0xFFE11D48);
  static const Color slate100 = Color(0xFFF1F5F9);
  static const Color slate300 = Color(0xFFCBD5E1);
  static const Color slate400 = Color(0xFF94A3B8);
  static const Color slate50 = Color(0xFFF8FAFC);
  static const Color slate700 = Color(0xFF334155);
  static const Color slate800 = Color(0xFF1E293B);
  static const Color slate900 = Color(0xFF0F172A);
  static const Color slate950 = Color(0xFF020617);
}

/// Colour roles, resolved to a full [ColorScheme] for each theme.
///
/// Screens read from `Theme.of(context).colorScheme` and never from
/// [BrandPalette] directly.
abstract final class BrandColors {

  static const ColorScheme dark = ColorScheme(
    brightness: Brightness.dark,
    primary: Color(0xFF10B981),
    onPrimary: Color(0xFF020617),
    primaryContainer: Color(0x2E10B981),
    onPrimaryContainer: Color(0xFF34D399),
    secondary: Color(0xFF06B6D4),
    onSecondary: Color(0xFF020617),
    secondaryContainer: Color(0x2E06B6D4),
    onSecondaryContainer: Color(0xFF22D3EE),
    tertiary: Color(0xFF06B6D4),
    onTertiary: Color(0xFF020617),
    error: Color(0xFFF43F5E),
    onError: Color(0xFFFB7185),
    errorContainer: Color(0x2EF43F5E),
    onErrorContainer: Color(0xFFFB7185),
    surface: Color(0xFF0F172A),
    onSurface: Color(0xFFF1F5F9),
    onSurfaceVariant: Color(0xFF94A3B8),
    surfaceContainerLowest: Color(0xFF020617),
    surfaceContainerLow: Color(0xFF020617),
    surfaceContainer: Color(0xFF1E293B),
    surfaceContainerHigh: Color(0xFF1E293B),
    surfaceContainerHighest: Color(0xFF1E293B),
    outline: Color(0xFF1E293B),
    outlineVariant: Color(0xFF334155),
    shadow: Colors.black,
    scrim: Colors.black,
    inverseSurface: Color(0xFF020617),
    onInverseSurface: Color(0xFFF1F5F9),
    inversePrimary: Color(0xFF10B981),
  );

  static const ColorScheme light = ColorScheme(
    brightness: Brightness.light,
    primary: Color(0xFF047857),
    onPrimary: Color(0xFF020617),
    primaryContainer: Color(0x2E047857),
    onPrimaryContainer: Color(0xFF047857),
    secondary: Color(0xFF0E7490),
    onSecondary: Color(0xFF020617),
    secondaryContainer: Color(0x2E0E7490),
    onSecondaryContainer: Color(0xFF0E7490),
    tertiary: Color(0xFF0E7490),
    onTertiary: Color(0xFF020617),
    error: Color(0xFFE11D48),
    onError: Color(0xFFE11D48),
    errorContainer: Color(0x2EE11D48),
    onErrorContainer: Color(0xFFE11D48),
    surface: Color(0xFFFFFFFF),
    onSurface: Color(0xFF020617),
    onSurfaceVariant: Color(0xFF556070),
    surfaceContainerLowest: Color(0xFFEAEFF5),
    surfaceContainerLow: Color(0xFFEAEFF5),
    surfaceContainer: Color(0xFFF8FAFC),
    surfaceContainerHigh: Color(0xFFF8FAFC),
    surfaceContainerHighest: Color(0xFFF8FAFC),
    outline: Color(0xFFCBD5E1),
    outlineVariant: Color(0xFF94A3B8),
    shadow: Colors.black,
    scrim: Colors.black,
    inverseSurface: Color(0xFFEAEFF5),
    onInverseSurface: Color(0xFF020617),
    inversePrimary: Color(0xFF047857),
  );
}

/// Dimensions. Logical pixels, which are density independent, so the px
/// values in the token file transfer without conversion.
abstract final class BrandDim {
  static const double xxxs = 2;
  static const double xxs = 4;
  static const double xs = 8;
  static const double sm = 12;
  static const double md = 16;
  static const double lg = 24;
  static const double xl = 32;
  static const double xxl = 48;
  static const double xxxl = 64;

  static const double radiusChip = 8;
  static const double radiusControl = 11;
  static const double radiusCard = 16;

  /// Hit area, not visual size. Pad to reach it; never shrink below it.
  static const double touchTargetAndroid = 48;
  static const double touchTargetIOS = 44;
  static const double touchGap = 8;

  /// Durations in milliseconds.
  static const int motionFast = 150;
  static const int motionNormal = 250;
}

/// Type roles mapped onto Material slots.
///
/// Font sizes come from Material's own scale rather than from the token
/// file, because the token file holds the web baseline and a phone is not
/// a small browser. What comes from the tokens is the two things that
/// actually carry the brand: the generous [TextStyle.height], and the
/// tracking.
abstract final class BrandText {
  static const TextStyle display = TextStyle(height: 1.2, letterSpacing: -0.72, fontWeight: FontWeight.w700);
  static const TextStyle title = TextStyle(height: 1.2, letterSpacing: -0.56, fontWeight: FontWeight.w700);
  static const TextStyle heading = TextStyle(height: 1.3, letterSpacing: -0.33, fontWeight: FontWeight.w700);
  static const TextStyle bodyLarge = TextStyle(height: 1.6);
  static const TextStyle body = TextStyle(height: 1.7);
  static const TextStyle label = TextStyle(height: 1.5, fontWeight: FontWeight.w600);
  static const TextStyle meta = TextStyle(height: 1.5, fontWeight: FontWeight.w500);
  static const TextStyle eyebrow = TextStyle(height: 1.4, letterSpacing: 1.43, fontWeight: FontWeight.w800);

  /// The full [TextTheme]. Spread into ThemeData.textTheme.
  static const TextTheme theme = TextTheme(
    displaySmall: display,
    headlineMedium: title,
    titleLarge: heading,
    bodyLarge: bodyLarge,
    bodyMedium: body,
    labelLarge: label,
    bodySmall: meta,
    labelSmall: eyebrow,
  );
}

/// Build the app theme. Call once, above [MaterialApp].
///
/// darkTheme follows the system rather than being forced: the brand is
/// dark-native, so following the user gets the benefit without forcing it.
///
/// Example:
///
/// ```dart
/// MaterialApp(
///   theme: brandTheme(Brightness.light),
///   darkTheme: brandTheme(Brightness.dark),
///   // themeMode defaults to ThemeMode.system, which is what we want.
/// )
/// ```
ThemeData brandTheme(Brightness brightness) {
  final isDark = brightness == Brightness.dark;
  final scheme = isDark ? BrandColors.dark : BrandColors.light;

  return ThemeData(
    brightness: brightness,
    colorScheme: scheme,
    // Set explicitly: ThemeData would otherwise derive it, and this brand
    // has a specific page colour rather than a tinted surface.
    scaffoldBackgroundColor: scheme.surfaceContainerLowest,
    textTheme: BrandText.theme,
    // Padded gives every tappable the 48dp Material minimum by default,
    // so you do not have to remember it per widget.
    materialTapTargetSize: MaterialTapTargetSize.padded,
    splashFactory: InkSparkle.splashFactory,
    cardTheme: CardThemeData(
      color: scheme.surface,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(BrandDim.radiusCard),
        side: BorderSide(color: scheme.outline, width: 1.5),
      ),
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        backgroundColor: scheme.primary,
        foregroundColor: scheme.onPrimary,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(BrandDim.radiusControl),
        ),
        minimumSize: const Size.fromHeight(0),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: scheme.surface,
      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(BrandDim.radiusControl),
        borderSide: BorderSide(color: scheme.outlineVariant),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(BrandDim.radiusControl),
        borderSide: BorderSide(color: scheme.outlineVariant),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(BrandDim.radiusControl),
        borderSide: BorderSide(color: scheme.primary, width: 1.5),
      ),
    ),
  );
}