# Public design system

`app/design-system.css` owns the shared public tokens, header, navigation, and footer. The Guide consumes a generated copy through its `site/scripts/sync-global-navigation.mjs --source=/path/to/FDLC` command. Run the same command with `--check` before releasing the pair. Page compositions and the Guide's reader controls remain owned by their respective applications.

Use cream paper, deep green actions, editorial serif headings, sans-serif interface text, and monospace technical values. Shared widths are 1240px for content and 760px for reading; spacing uses 4/8/12/16/24/32px increments. Controls have 44px minimum targets and 4px corners; cards use 6px corners. Status words always carry meaning independently of color. Never equate qualification or synthetic evidence with live operation.

Global navigation changes to a touch menu at 1100px in both apps. Desktop disclosure menus support arrows, Escape, and natural Tab/Shift+Tab exit. The Guide search palette remains a modal with its own focus containment and restoration. Reader search/theme controls sit below the common header so the header does not change between applications.

Tables use sans-serif text, 14px body/13px header, consistent cell padding and local horizontal scrolling. Technical values wrap without truncation. Copy controls report success or failure without replacing the value. Reduced motion disables nonessential transitions.

Production audit: 23 representative routes at 1440, 900, and 390px. Findings addressed include differing header geometry/breakpoints, trapped keyboard focus, tablet home overflow, a long Guide qualification label overflowing mobile, duplicate scroll-region names, tiny qualification IDs/status labels, and disconnected footer styles. Preserve existing product hierarchy and technical claims; qualify the exact FDLC/Guide release pair after merge.
