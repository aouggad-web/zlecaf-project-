#!/bin/bash
###############################################################################
# AfCFTA 2025 Datasets Generator
# 
# This script generates African Continental Free Trade Area (AfCFTA/ZLECAf) 
# datasets for the year 2025 and beyond. It wraps the Lyra+ Data Release 
# Pipeline with convenient options and better error handling.
#
# Usage:
#   ./afcfta_2025_datasets.sh [OPTIONS]
#
# Options:
#   --demo          Generate demo/sample data (default)
#   --production    Generate production data (requires real API integrations)
#   --output DIR    Specify output directory (default: frontend/public/data)
#   --help          Show this help message
#
# Examples:
#   ./afcfta_2025_datasets.sh --demo
#   ./afcfta_2025_datasets.sh --production --output /path/to/output
#
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
MODE="demo"
OUTPUT_DIR="frontend/public/data"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

###############################################################################
# Functions
###############################################################################

print_header() {
    echo -e "${BLUE}================================================================${NC}"
    echo -e "${BLUE}   AfCFTA 2025 Datasets Generator${NC}"
    echo -e "${BLUE}   Lyra+ Data Release Pipeline${NC}"
    echo -e "${BLUE}================================================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

show_help() {
    cat << EOF
AfCFTA 2025 Datasets Generator

This script generates African Continental Free Trade Area (AfCFTA/ZLECAf) 
datasets including:
  - Tariff lines by country (JSON)
  - Africa vs World tariffs comparison (XLSX/CSV)
  - Rules of origin by sector (JSON)
  - Dismantling schedule (CSV)
  - Integrated tariff/origin/phase data (JSON)

Usage:
  ./afcfta_2025_datasets.sh [OPTIONS]

Options:
  --demo              Generate demo/sample data (default)
  --production        Generate production data (requires API integrations)
  --output DIR        Specify output directory (default: frontend/public/data)
  --help              Show this help message

Examples:
  # Generate demo data (default)
  ./afcfta_2025_datasets.sh

  # Generate demo data explicitly
  ./afcfta_2025_datasets.sh --demo

  # Generate production data (requires setup)
  ./afcfta_2025_datasets.sh --production

  # Specify custom output directory
  ./afcfta_2025_datasets.sh --demo --output /tmp/afcfta-data

For more information, see:
  - docs/LYRA_OPS.md
  - LYRA_OPS_IMPLEMENTATION.md
  - backend/make_release.py

EOF
    exit 0
}

check_prerequisites() {
    print_info "Checking prerequisites..."
    
    # Check if Python is installed
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed. Please install Python 3.8 or higher."
        exit 1
    fi
    
    PYTHON_VERSION=$(python3 --version | awk '{print $2}')
    print_success "Python $PYTHON_VERSION found"
    
    # Check if the make_release.py script exists
    if [ ! -f "$SCRIPT_DIR/backend/make_release.py" ]; then
        print_error "Backend script not found: $SCRIPT_DIR/backend/make_release.py"
        exit 1
    fi
    print_success "Data pipeline script found"
    
    # Check if output directory parent exists or can be created
    OUTPUT_PARENT=$(dirname "$OUTPUT_DIR")
    if [ ! -d "$OUTPUT_PARENT" ] && [ "$OUTPUT_PARENT" != "." ]; then
        print_warning "Output parent directory does not exist: $OUTPUT_PARENT"
        print_info "It will be created automatically"
    fi
    
    echo ""
}

install_dependencies() {
    print_info "Checking Python dependencies..."
    
    # Check if openpyxl is available (optional for Excel support)
    if python3 -c "import openpyxl" 2>/dev/null; then
        print_success "openpyxl is installed (Excel support enabled)"
    else
        print_warning "openpyxl not installed (Excel files will be generated as CSV)"
        print_info "To enable Excel support, run: pip install openpyxl"
    fi
    
    echo ""
}

generate_datasets() {
    print_info "Starting data generation..."
    print_info "Mode: $MODE"
    print_info "Output: $OUTPUT_DIR"
    echo ""
    
    # Build command
    CMD="python3 $SCRIPT_DIR/backend/make_release.py"
    
    if [ "$MODE" = "demo" ]; then
        CMD="$CMD --demo"
    fi
    
    CMD="$CMD --output $OUTPUT_DIR"
    
    # Execute the Python script
    if $CMD; then
        echo ""
        print_success "Data generation completed successfully!"
        return 0
    else
        echo ""
        print_error "Data generation failed!"
        return 1
    fi
}

verify_output() {
    print_info "Verifying generated files..."
    
    EXPECTED_FILES=(
        "zlecaf_tariff_lines_by_country.json"
        "zlecaf_rules_of_origin.json"
        "zlecaf_dismantling_schedule.csv"
        "zlecaf_tariff_origin_phase.json"
    )
    
    # Also check for either xlsx or csv version of the comparison file
    COMPARISON_FILE=""
    if [ -f "$OUTPUT_DIR/zlecaf_africa_vs_world_tariffs.xlsx" ]; then
        COMPARISON_FILE="zlecaf_africa_vs_world_tariffs.xlsx"
    elif [ -f "$OUTPUT_DIR/zlecaf_africa_vs_world_tariffs.csv" ]; then
        COMPARISON_FILE="zlecaf_africa_vs_world_tariffs.csv"
    fi
    
    ALL_PRESENT=true
    
    for file in "${EXPECTED_FILES[@]}"; do
        if [ -f "$OUTPUT_DIR/$file" ]; then
            FILE_SIZE=$(stat -f%z "$OUTPUT_DIR/$file" 2>/dev/null || stat -c%s "$OUTPUT_DIR/$file" 2>/dev/null)
            print_success "$file (${FILE_SIZE} bytes)"
        else
            print_error "$file is missing!"
            ALL_PRESENT=false
        fi
    done
    
    if [ -n "$COMPARISON_FILE" ]; then
        FILE_SIZE=$(stat -f%z "$OUTPUT_DIR/$COMPARISON_FILE" 2>/dev/null || stat -c%s "$OUTPUT_DIR/$COMPARISON_FILE" 2>/dev/null)
        print_success "$COMPARISON_FILE (${FILE_SIZE} bytes)"
    else
        print_error "zlecaf_africa_vs_world_tariffs.* is missing!"
        ALL_PRESENT=false
    fi
    
    echo ""
    
    if [ "$ALL_PRESENT" = true ]; then
        print_success "All expected files are present"
        return 0
    else
        print_error "Some files are missing"
        return 1
    fi
}

print_summary() {
    echo ""
    echo -e "${BLUE}================================================================${NC}"
    echo -e "${GREEN}   AFCFTA 2025 Datasets Generation Complete!${NC}"
    echo -e "${BLUE}================================================================${NC}"
    echo ""
    print_info "Generated files location: $OUTPUT_DIR"
    echo ""
    print_info "Next steps:"
    echo "  1. Review the generated files in: $OUTPUT_DIR"
    echo "  2. Test the data with: python backend/server.py"
    echo "  3. Check data quality with: curl http://localhost:8000/api/health"
    echo ""
    print_info "For production deployment:"
    echo "  - Update backend/make_release.py with real data sources"
    echo "  - Run with: ./afcfta_2025_datasets.sh --production"
    echo ""
}

###############################################################################
# Main Script
###############################################################################

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --demo)
            MODE="demo"
            shift
            ;;
        --production)
            MODE="production"
            shift
            ;;
        --output)
            OUTPUT_DIR="$2"
            shift 2
            ;;
        --help)
            show_help
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Main execution
print_header
check_prerequisites
install_dependencies

if generate_datasets; then
    if verify_output; then
        print_summary
        exit 0
    else
        print_error "Data verification failed"
        exit 1
    fi
else
    print_error "Data generation failed"
    exit 1
fi
