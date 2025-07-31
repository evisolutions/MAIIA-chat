# Translations Implementation for MAIIA Chat Widget

## Overview

This document describes the implementation of multi-language support for the MAIIA chat widget, specifically for the `websiteAddon` conversation type.

## Implementation Details

### 1. Data Structure

The new translations system uses the following data structure from the API endpoint `/property/fetch-single?propertyId=15`:

```json
{
  "translations": {
    "websiteAddon": {
      "en": {
        "welcomeText": "Hello, I'm Sunčica, the AI concierge of Hotel Sunce...",
        "labels": [
          {
            "label": "about hotel",
            "labelText": "What can you tell me about the hotel and its amenities?"
          },
          {
            "label": "about rooms", 
            "labelText": "What types of rooms do you offer?"
          }
        ]
      },
      "sr": {
        "welcomeText": "Pozdrav ja sam Sunčica, AI konsijerž hotela Sunce...",
        "labels": [
          {
            "label": "o hotelu",
            "labelText": "Šta mi možeš reći o hotelu i sadržaju unutar hotela?"
          }
        ]
      }
    }
  }
}
```

### 2. Modified Files

#### `src/views/apps/chat/useChatStore.js`

**Changes made:**

1. **Modified `setInitialChat()` method:**
   - Added logic to detect current locale from `localStorage`
   - Implemented fallback chain: current locale → English → old system
   - Uses `translations.websiteAddon[locale].welcomeText` for welcome message
   - Uses `translations.websiteAddon[locale].labels[].labelText` for choice buttons

2. **Added `updateInitialChatForLanguage()` method:**
   - Updates the initial chat message when language changes
   - Only updates if there's exactly one message (initial state)
   - Maintains the same fallback logic

#### `src/App.vue`

**Changes made:**

1. **Added locale watcher:**
   - Watches for changes in `locale.value`
   - Calls `chatStore.updateInitialChatForLanguage()` when language changes
   - Enables real-time language switching

2. **Fixed variable naming:**
   - Replaced all instances of `store` with `chatStore` for consistency

#### `src/views/apps/chat/ChatLog.vue`

**Changes made:**

1. **Fixed variable naming:**
   - Replaced all instances of `store` with `chatStore` for consistency

### 3. Fallback Logic

The implementation includes a robust fallback system:

1. **Primary:** Use `translations.websiteAddon[currentLocale]`
2. **Secondary:** Use `translations.websiteAddon.en` (English fallback)
3. **Tertiary:** Use old system (`welcomeMessage` and `welcomeSelectMessages`)

### 4. Language Detection

- Uses `localStorage.getItem("locale")` to get current language
- Defaults to "en" if no locale is set
- Supports real-time language switching

### 5. Testing

A test file `test-translations.html` has been created to test the implementation:

- Allows switching between English and Serbian
- Uses property ID 15 (Hotel Sunce) which has translation data
- Provides clear instructions for testing

## Usage

### For Developers

1. **API Response:** Ensure the property endpoint returns `translations.websiteAddon` data
2. **Language Support:** Add new languages by extending the `translations.websiteAddon` object
3. **Testing:** Use the test file to verify functionality

### For End Users

1. **Language Selection:** Users can change language using the language selector
2. **Real-time Updates:** Welcome message and choice buttons update immediately
3. **Fallback:** If a language is not available, English is used as fallback

## Supported Languages

Currently supported:
- **English (en):** Primary language with full fallback support
- **Serbian (sr):** Secondary language with full translation support

## Future Enhancements

1. **Additional Languages:** Easy to add more languages by extending the translations object
2. **Dynamic Loading:** Could implement dynamic loading of translation files
3. **User Preferences:** Could store user language preference in backend
4. **Auto-detection:** Could implement browser language auto-detection

## API Requirements

The property endpoint must return:

```json
{
  "message": "success",
  "data": {
    "id": 15,
    "name": "Hotel Sunce",
    "translations": {
      "websiteAddon": {
        "en": { ... },
        "sr": { ... }
      }
    }
  }
}
```

## Testing

To test the implementation:

1. Open `test-translations.html` in a browser
2. Select different languages using the dropdown
3. Open the chat widget and observe the welcome message and choice buttons
4. Verify that the content changes based on the selected language

## Troubleshooting

### Common Issues

1. **No translations shown:** Check if the property has `translations.websiteAddon` data
2. **Language not changing:** Verify that `localStorage.setItem('locale', lang)` is working
3. **Fallback not working:** Check if English translations exist in the API response

### Debug Steps

1. Check browser console for errors
2. Verify API response contains translation data
3. Check localStorage for correct locale value
4. Ensure all dependencies are loaded correctly 
