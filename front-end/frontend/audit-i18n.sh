#!/bin/bash
# Script to audit and report i18n compliance across frontend

echo "🔍 Scanning frontend for i18n violations..."
echo ""

cd "$(dirname "$0")" || exit

# Colors
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Summary
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}i18n Enforcement Audit Report${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""

# Run lint and capture output
LINT_OUTPUT=$(npm run lint 2>&1)

# Count violations by type
echo -e "${YELLOW}📊 Violation Summary:${NC}"
echo ""

# Count hardcoded strings
HARDCODED_STRINGS=$(echo "$LINT_OUTPUT" | grep -c "no-hardcoded-strings" || echo 0)
if [ "$HARDCODED_STRINGS" -gt 0 ]; then
  echo -e "${RED}❌ Hardcoded Strings: $HARDCODED_STRINGS${NC}"
else
  echo -e "${GREEN}✅ Hardcoded Strings: 0${NC}"
fi

# Count HTML attributes
HTML_ATTRS=$(echo "$LINT_OUTPUT" | grep -c "no-hardcoded-html-attributes" || echo 0)
if [ "$HTML_ATTRS" -gt 0 ]; then
  echo -e "${RED}❌ HTML Attributes: $HTML_ATTRS${NC}"
else
  echo -e "${GREEN}✅ HTML Attributes: 0${NC}"
fi

# Count API URLs
API_URLS=$(echo "$LINT_OUTPUT" | grep -c "no-api-urls" || echo 0)
if [ "$API_URLS" -gt 0 ]; then
  echo -e "${RED}❌ API URLs: $API_URLS${NC}"
else
  echo -e "${GREEN}✅ API URLs: 0${NC}"
fi

# Count toast messages
TOASTS=$(echo "$LINT_OUTPUT" | grep -c "no-hardcoded-toast-messages" || echo 0)
if [ "$TOASTS" -gt 0 ]; then
  echo -e "${RED}❌ Toast Messages: $TOASTS${NC}"
else
  echo -e "${GREEN}✅ Toast Messages: 0${NC}"
fi

echo ""
TOTAL=$((HARDCODED_STRINGS + HTML_ATTRS + API_URLS + TOASTS))
echo -e "${BLUE}Total Violations: $TOTAL${NC}"
echo ""

# Detailed violations
echo -e "${YELLOW}📝 Detailed Violations:${NC}"
echo ""

if [ "$HARDCODED_STRINGS" -gt 0 ]; then
  echo -e "${RED}Hardcoded Strings:${NC}"
  echo "$LINT_OUTPUT" | grep "no-hardcoded-strings" | head -5
  echo ""
fi

if [ "$HTML_ATTRS" -gt 0 ]; then
  echo -e "${RED}HTML Attributes:${NC}"
  echo "$LINT_OUTPUT" | grep "no-hardcoded-html-attributes" | head -5
  echo ""
fi

if [ "$API_URLS" -gt 0 ]; then
  echo -e "${RED}API URLs:${NC}"
  echo "$LINT_OUTPUT" | grep "no-api-urls" | head -5
  echo ""
fi

if [ "$TOASTS" -gt 0 ]; then
  echo -e "${RED}Toast Messages:${NC}"
  echo "$LINT_OUTPUT" | grep "no-hardcoded-toast-messages" | head -5
  echo ""
fi

# Recommendations
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}💡 Recommended Actions:${NC}"
echo ""

if [ "$TOTAL" -eq 0 ]; then
  echo -e "${GREEN}🎉 Congratulations! Your frontend is fully i18n compliant!${NC}"
else
  echo "1. Run auto-fix for basic issues:"
  echo "   ${BLUE}npm run lint:fix${NC}"
  echo ""
  echo "2. Format code:"
  echo "   ${BLUE}npm run format${NC}"
  echo ""
  echo "3. Fix remaining issues manually:"
  echo "   ${BLUE}npm run lint${NC}"
  echo ""
  echo "4. Read guides for detailed fixes:"
  echo "   - HTML_TOAST_I18N_GUIDE.md"
  echo "   - EXAMPLES_BEST_PRACTICES.md"
  echo "   - APPLY_I18N_ENFORCEMENT.md"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
