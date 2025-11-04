# Verification Dialog Specification

## Overview
The verification dialog is a modal that appears before executing tariff calculations, allowing users to review and confirm their inputs.

## Visual Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  ✅ Vérification des Informations                            │
│  (Verify Information)                                         │
│                                                               │
│  Veuillez vérifier les informations avant de lancer         │
│  le calcul tarifaire.                                        │
│  (Please verify the information before proceeding)           │
│                                                               │
│  ┌──────────────────────┐  ┌──────────────────────┐        │
│  │ Pays d'origine       │  │ Pays de destination  │        │
│  │ (Origin Country)     │  │ (Destination Country)│        │
│  │                      │  │                      │        │
│  │ 🇰🇪 Kenya           │  │ 🇬🇭 Ghana            │        │
│  └──────────────────────┘  └──────────────────────┘        │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Code SH6 et Secteur                                   │  │
│  │ (HS6 Code and Sector)                                 │  │
│  │                                                        │  │
│  │ 010121                                                │  │
│  │ Animaux vivants / Live animals                        │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Valeur de la marchandise                              │  │
│  │ (Merchandise Value)                                    │  │
│  │                                                        │  │
│  │ $100,000                                              │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│                       [❌ Annuler]  [✓ Confirmer et Calculer] │
│                       (Cancel)      (Confirm and Calculate)   │
└─────────────────────────────────────────────────────────────┘
```

## Color Scheme

### Input Fields
- **Origin Country Box**: Blue background (#EFF6FF), Blue border (#BFDBFE)
- **Destination Country Box**: Green background (#F0FDF4), Green border (#BBF7D0)
- **HS Code Box**: Orange background (#FFF7ED), Orange border (#FED7AA)
- **Value Box**: Purple background (#FAF5FF), Purple border (#E9D5FF)

### Buttons
- **Cancel Button**: Default gray with hover effect
- **Confirm Button**: Green-to-blue gradient (#059669 to #2563EB)

## Interaction Flow

1. **Trigger**: User clicks "Calculate" button (🧮 Calculer avec Données Officielles)

2. **Validation**: 
   - Check if all fields are filled
   - Validate HS code is 6 digits
   - Show error toast if validation fails

3. **Display Dialog**:
   - Show verification dialog with all inputs
   - Display country flags using emoji
   - Format currency with thousand separators
   - Show sector name based on HS code prefix

4. **User Actions**:
   - **Cancel**: Close dialog, return to form
   - **Confirm**: Close dialog, execute calculation API call

5. **Post-Confirmation**:
   - Show loading state
   - Execute API call
   - Display results
   - Show success toast with savings amount

## Responsive Design

### Desktop (>= 768px)
- Dialog width: max-width: 42rem (672px)
- Two-column layout for countries
- Full-width sections for HS code and value

### Mobile (< 768px)
- Dialog width: 95% of screen width
- Single column layout for all fields
- Stacked buttons for better touch targets

## Accessibility Features

- **Keyboard Navigation**: 
  - Tab through Cancel and Confirm buttons
  - Enter key confirms
  - Escape key cancels

- **ARIA Labels**:
  - Dialog has proper role="dialog"
  - Title is aria-labelledby
  - Description is aria-describedby

- **Screen Reader Friendly**:
  - All labels read clearly
  - Currency amounts announced correctly
  - Country names announced with flags

## Localization

### French (Default)
- Title: "Vérification des Informations"
- Description: "Veuillez vérifier les informations avant de lancer le calcul tarifaire."
- Labels: "Pays d'origine", "Pays de destination", "Code SH6 et Secteur", "Valeur de la marchandise"
- Buttons: "❌ Annuler", "✓ Confirmer et Calculer"

### English
- Title: "Verify Information"
- Description: "Please verify the information before proceeding with the tariff calculation."
- Labels: "Origin Country", "Destination Country", "HS6 Code and Sector", "Merchandise Value"
- Buttons: "❌ Cancel", "✓ Confirm and Calculate"

## Technical Implementation

### Component
```javascript
<AlertDialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
  <AlertDialogContent className="max-w-2xl">
    <AlertDialogHeader>
      <AlertDialogTitle>...</AlertDialogTitle>
      <AlertDialogDescription>...</AlertDialogDescription>
    </AlertDialogHeader>
    
    <div className="space-y-4 py-4">
      {/* Country selection cards */}
      {/* HS code card */}
      {/* Value card */}
    </div>
    
    <AlertDialogFooter>
      <AlertDialogCancel>...</AlertDialogCancel>
      <AlertDialogAction onClick={calculateTariff}>...</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### State Management
```javascript
const [showVerificationDialog, setShowVerificationDialog] = useState(false);

const handleCalculateClick = () => {
  // Validate inputs
  if (validation fails) {
    // Show error toast
    return;
  }
  // Show dialog
  setShowVerificationDialog(true);
};

const calculateTariff = async () => {
  // Close dialog
  setShowVerificationDialog(false);
  // Execute calculation
  // ...
};
```

## Benefits

1. **Error Prevention**: Users catch mistakes before calculation
2. **Transparency**: Clear view of what will be calculated
3. **Confidence**: Users trust the results more
4. **Professional UX**: Modern, polished user experience
5. **Reduces Support**: Fewer errors = fewer support requests

## User Feedback

Expected user reactions:
- ✅ "I like that I can review before calculating"
- ✅ "The flags make it easy to see countries at a glance"
- ✅ "Good to double-check the amount"
- ✅ "Professional and trustworthy interface"

## Testing Checklist

- [ ] Dialog opens on calculate button click
- [ ] All input values display correctly
- [ ] Country flags render properly
- [ ] HS code sector name shows correctly
- [ ] Currency formatting is accurate
- [ ] Cancel button closes dialog
- [ ] Confirm button triggers calculation
- [ ] Escape key closes dialog
- [ ] Click outside closes dialog
- [ ] Responsive on mobile devices
- [ ] Accessible with keyboard only
- [ ] Screen reader announces correctly
- [ ] Both languages work correctly
