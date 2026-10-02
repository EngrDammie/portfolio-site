// GENERATED FILE - DO NOT EDIT BY HAND.
// Produced by scripts/build-adapters.mjs from tokens.json.
// Edit tokens.json, then run: npm run tokens:build
// Checked for staleness by: npm run adapters:check
//
// Note on type: this adapter deliberately does NOT carry font sizes. iOS
// scales text through Dynamic Type, so a pinned point size fights the
// user. Roles map to Font.TextStyle instead - see Brand.Role.
//
// Source of truth: tokens.json

import SwiftUI

enum Brand {

    // MARK: - Palette (internal use only)
    enum Palette {
        static let Amber400 = Color(hex: 0xFBBF24)
        static let Amber500 = Color(hex: 0xF59E0B)
        static let Amber700 = Color(hex: 0xB45309)
        static let Cyan400 = Color(hex: 0x22D3EE)
        static let Cyan500 = Color(hex: 0x06B6D4)
        static let Cyan700 = Color(hex: 0x0E7490)
        static let Emerald400 = Color(hex: 0x34D399)
        static let Emerald500 = Color(hex: 0x10B981)
        static let Emerald700 = Color(hex: 0x047857)
        static let Paper = Color(hex: 0xEAEFF5)
        static let Rose400 = Color(hex: 0xFB7185)
        static let Rose500 = Color(hex: 0xF43F5E)
        static let Rose700 = Color(hex: 0xE11D48)
        static let Slate100 = Color(hex: 0xF1F5F9)
        static let Slate300 = Color(hex: 0xCBD5E1)
        static let Slate400 = Color(hex: 0x94A3B8)
        static let Slate50 = Color(hex: 0xF8FAFC)
        static let Slate700 = Color(hex: 0x334155)
        static let Slate800 = Color(hex: 0x1E293B)
        static let Slate900 = Color(hex: 0x0F172A)
        static let Slate950 = Color(hex: 0x020617)
        static let Swatch556070 = Color(hex: 0x556070)
        static let SwatchEAEFF5 = Color(hex: 0xEAEFF5)
        static let SwatchFFFFFF = Color(hex: 0xFFFFFF)
        static let white = Color(hex: 0xFFFFFF)
    }

    // MARK: - Colour roles
    //
    // Screens use these, never Palette directly. A plain name is for fills
    // and borders; the Text-suffixed one is the only variant permitted for
    // coloured text. That distinction is the same on every platform.
    //
    // Declared as nested enums of assignments rather than a struct with a
    // memberwise initialiser: an initialiser can only be correct if every
    // palette name it references exists, and that is exactly the bug this
    // shape was rewritten to remove.
    enum Colors {
        static let background = Palette.Slate950
        static let surface = Palette.Slate900
        static let surfaceRaised = Palette.Slate800
        static let border = Palette.Slate800
        static let borderStrong = Palette.Slate700
        static let text = Palette.Slate100
        static let textBody = Palette.Slate300
        static let textMuted = Palette.Slate400
        static let brand = Palette.Emerald500
        static let brandText = Palette.Emerald400
        static let accent = Palette.Cyan500
        static let accentText = Palette.Cyan400
        static let warning = Palette.Amber500
        static let warningText = Palette.Amber400
        static let danger = Palette.Rose500
        static let dangerText = Palette.Rose400
        static let onBrand = Palette.Slate950

        /// Light theme. Accent values take a DARKER step, never the dark
        /// value above. Reusing the dark accents here is the single most
        /// common way this brand is broken on a light background.
        enum Light {
            static let background = Palette.SwatchEAEFF5
            static let surface = Palette.SwatchFFFFFF
            static let surfaceRaised = Palette.Slate50
            static let border = Palette.Slate300
            static let borderStrong = Palette.Slate400
            static let text = Palette.Slate950
            static let textBody = Palette.Slate700
            static let textMuted = Palette.Swatch556070
            static let brand = Palette.Emerald700
            static let brandText = Palette.Emerald700
            static let accent = Palette.Cyan700
            static let accentText = Palette.Cyan700
            static let warning = Palette.Amber700
            static let warningText = Palette.Amber700
            static let danger = Palette.Rose700
            static let dangerText = Palette.Rose700
            static let onBrand = Palette.Slate950
        }
    }

    // MARK: - Dimensions
    enum Dimension {
        static let touchTargetIOS: CGFloat = 44
        static let touchGap: CGFloat = 8
        static let radiusChip: CGFloat = 8
        static let radiusControl: CGFloat = 11
        static let radiusCard: CGFloat = 16
        static let borderWidth: CGFloat = 1.5
        static let gutter: CGFloat = 22

        enum Spacing {
            static let Xxxs: CGFloat = 2
            static let Xxs: CGFloat = 4
            static let Xs: CGFloat = 8
            static let Sm: CGFloat = 12
            static let Md: CGFloat = 16
            static let Lg: CGFloat = 24
            static let Xl: CGFloat = 32
            static let Xxl: CGFloat = 48
            static let Xxxl: CGFloat = 64
        }
    }

    // MARK: - Type roles
    //
    // A role, not a size. Using these lets Dynamic Type do its job; setting
    // .system(size:) instead will silently break accessibility text sizes.
    enum Role {
        static let display: Font.TextStyle = .largeTitle
        static let title: Font.TextStyle = .title
        static let heading: Font.TextStyle = .headline
        static let bodyLarge: Font.TextStyle = .body
        static let body: Font.TextStyle = .body
        static let label: Font.TextStyle = .subheadline
        static let meta: Font.TextStyle = .footnote
        static let eyebrow: Font.TextStyle = .caption
    }

    // MARK: - Theme
    static func background(_ scheme: ColorScheme) -> Color {
        scheme == .dark ? Palette.Slate950 : Palette.Paper
    }

    static func surface(_ scheme: ColorScheme) -> Color {
        scheme == .dark ? Palette.Slate900 : Palette.white
    }
}

/// Convenience: the role set for a colour scheme.
extension Brand {
    static func colors(_ scheme: ColorScheme) -> Brand.Colors {
        scheme == .dark ? .dark : .light
    }
}
extension Color {
    /// Accepts 0xRRGGBB or 0xAARRGGBB. Used by the generated palette above.
    init(hex: UInt32) {
        self.init(
            .sRGB,
            red: Double((hex >> 16) & 0xFF) / 255,
            green: Double((hex >> 8) & 0xFF) / 255,
            blue: Double(hex & 0xFF) / 255,
            opacity: 1
        )
    }
}