## 2. Wire it up

### 2.1 Add the theme to your target

Add Part 5 to the app target in Xcode. Nothing else is required — the file
carries no fonts and no assets, so there is nothing to register.

### 2.2 Read values from the theme, not from constants you invent

```swift
Text("Hello")
    .font(Brand.Role.body)
    .foregroundStyle(Brand.Colors.textBody)
```

`Brand.Role` members are `Font.TextStyle` values, so Dynamic Type keeps working. `Brand.Colors`
holds the palette, and `Brand.Colors.Light` is the light-theme set.

### 2.3 Support both appearances

The brand is dark-native, but iOS users expect both. Resolve against the environment rather than
hardcoding, and confirm both look right before you report.

## 3. Rules that override anything you would otherwise choose

0. **Never use `.system(size:)`.** That is the single most common way Dynamic Type gets broken, and
   it is the reason `Brand.swift` carries no font sizes at all — that absence is the design, not an
   oversight. Use `Brand.Role`, or another `Font.TextStyle`, so the size can scale.
1. Colour comes from `Brand.Colors` (or `Brand.Palette` for a raw swatch). Never a literal hex in a
   view.
2. Never pin a fixed frame height on text. Let it grow with Dynamic Type, and test at the largest
   accessibility size.
3. Never disable Dynamic Type, and never clamp with `.dynamicTypeSize(...)` to stop a layout
   breaking. Fix the layout instead.
4. Every interactive element reaches a 44x44pt touch target, with at least 8pt between targets. The
   target may be larger than the visual — pad to reach it. Never shrink the target to fit.
5. Respect safe areas. No content under the notch, home indicator or status bar.
6. System font only — San Francisco. Do not bundle Geist or any custom font.
7. Design loading, empty, offline and error states. On a phone these are most of the experience,
   not the polish at the end of it.

## 4. Check every one of these before you report

Run each check. Report every failure with its file and line. Do not claim a pass you have not
verified.

- [ ] `Brand.swift` is in the target and compiles.
- [ ] No `.system(size:` anywhere in your code.
- [ ] No `Color(hex:` or raw hex literal in any view.
- [ ] No `.dynamicTypeSize(` clamp and no fixed frame height on text.
- [ ] Every tappable element measures at least 44x44pt.
- [ ] Nothing is drawn under the notch or home indicator.
- [ ] Every screen that fetches anything has loading, empty, offline and error states.
- [ ] You have run or previewed the app at the **largest** accessibility text size and nothing is
      clipped or overlapping.
- [ ] You have checked both light and dark appearance.
- [ ] The project builds. Paste the real result.

## 5. Report back

End your reply with exactly this block:

```
Brand:    Dammie Optimus Solutions design kit <version> (<content hash>)
Theme:    Brand.swift (target: <your target name>)
Build:    <pass, or the exact error>
Failures: <list, or "none">
Assumed:  <anything you decided that this file did not tell you>
```

If a check failed, say so plainly. An agent that reports its own failures is useful. One that hides
them costs more time than it saves.
