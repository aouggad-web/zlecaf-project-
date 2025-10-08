# Badge Component Documentation

## Overview

The Badge component is a versatile UI element used throughout the ZLECAf application to display labels, status indicators, categories, and other metadata in a visually consistent manner.

## Component Location

```
frontend/src/components/ui/badge.jsx
```

## Usage

### Basic Import

```jsx
import { Badge } from './components/ui/badge';
```

### Variants

The Badge component supports four variants:

#### 1. Default
Primary brand-colored badge for important information.

```jsx
<Badge variant="default">Default Badge</Badge>
```

**Style**: Blue background with white text, subtle shadow

#### 2. Secondary
Softer appearance for secondary information.

```jsx
<Badge variant="secondary">Secondary Badge</Badge>
```

**Style**: Gray background with dark text

#### 3. Outline
Minimal style with border only, no background fill.

```jsx
<Badge variant="outline">Outline Badge</Badge>
```

**Style**: Transparent background with border

#### 4. Destructive
For warnings, errors, or critical information.

```jsx
<Badge variant="destructive">Destructive Badge</Badge>
```

**Style**: Red background with white text

## Examples in the Application

### 1. Rules of Origin - Rule Type Display

```jsx
<Badge variant="secondary" className="text-lg px-3 py-1">
  {rulesOfOrigin.rules.rule}
</Badge>
```

**Location**: `frontend/src/App.js` - Rules tab
**Purpose**: Display the type of origin rule (e.g., "Entièrement obtenus")

### 2. Documentation Requirements

```jsx
{rulesOfOrigin.explanation.documentation_required.map((doc, index) => (
  <Badge key={index} variant="outline">
    {doc}
  </Badge>
))}
```

**Location**: `frontend/src/App.js` - Rules tab
**Purpose**: List required documentation for customs clearance

### 3. Data Sources

```jsx
{statistics.data_sources.map((source, index) => (
  <Badge key={index} variant="outline" className="text-center">
    {source}
  </Badge>
))}
```

**Location**: `frontend/src/App.js` - Statistics tab
**Purpose**: Display data source providers

### 4. Country Exports

```jsx
{countryProfile.projections?.main_exports?.map((exp, index) => (
  <Badge key={index} variant="outline" className="text-xs">
    {exp}
  </Badge>
))}
```

**Location**: `frontend/src/App.js` - Country profiles tab
**Purpose**: Show main export products of a country

## Customization

### Custom Classes

You can add custom Tailwind CSS classes to further style badges:

```jsx
<Badge variant="outline" className="text-xs font-bold uppercase">
  Custom Styled
</Badge>
```

### Size Variations

```jsx
{/* Small */}
<Badge className="text-xs px-2 py-0.5">Small</Badge>

{/* Default */}
<Badge>Default Size</Badge>

{/* Large */}
<Badge className="text-lg px-4 py-1.5">Large</Badge>
```

### Color Customization

While the variants cover most use cases, you can override colors:

```jsx
<Badge className="bg-green-500 text-white border-green-700">
  Custom Color
</Badge>
```

## Accessibility

The Badge component is built with accessibility in mind:

- Uses semantic HTML (`div` with appropriate ARIA attributes)
- Maintains proper color contrast ratios
- Supports keyboard navigation through focus states
- Responsive to screen readers

## Best Practices

### Do's ✅

- Use badges for categorical information
- Keep badge text concise (1-3 words)
- Group related badges together
- Use consistent variants throughout the app
- Use outline variant for non-critical information

### Don'ts ❌

- Don't use badges for long sentences
- Don't mix too many variants in the same context
- Don't use badges as buttons (use Button component instead)
- Don't rely solely on color to convey information

## API Integration

Badges are commonly used to display API response data:

### Example: Displaying Country Data

```jsx
const CountryBadges = ({ country }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">{country.region}</Badge>
      <Badge variant="outline">ISO: {country.iso3}</Badge>
      <Badge variant="secondary">
        Pop: {(country.population / 1000000).toFixed(1)}M
      </Badge>
    </div>
  );
};
```

### Example: Status Indicators

```jsx
const StatusBadge = ({ status }) => {
  const variantMap = {
    active: 'default',
    pending: 'secondary',
    inactive: 'outline',
    error: 'destructive'
  };
  
  return (
    <Badge variant={variantMap[status] || 'outline'}>
      {status.toUpperCase()}
    </Badge>
  );
};
```

## Health Status Badges

For API health monitoring, use badges to indicate service status:

```jsx
const HealthBadge = ({ status }) => {
  return status === 'healthy' ? (
    <Badge variant="default" className="bg-green-500">
      🟢 Healthy
    </Badge>
  ) : (
    <Badge variant="destructive">
      🔴 Unhealthy
    </Badge>
  );
};
```

## Component Architecture

The Badge component uses:
- **class-variance-authority (cva)**: For variant management
- **Tailwind CSS**: For styling
- **cn utility**: For class name merging

### Source Code Structure

```jsx
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)
```

## Migration Guide

If updating from a previous version:

1. Import the new Badge component
2. Replace old badge markup with the new component
3. Update variant names if changed
4. Test visual appearance across the application

## Related Components

- **Button**: For interactive elements
- **Alert**: For important messages
- **Card**: For content containers
- **Label**: For form field labels

## Support

For issues or questions about the Badge component:
- Check the implementation in `frontend/src/components/ui/badge.jsx`
- Review examples in `frontend/src/App.js`
- Consult Tailwind CSS documentation for styling questions
