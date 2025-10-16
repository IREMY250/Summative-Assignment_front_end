# Finance Dashboard

A simple finance tracking application for students to manage income and expenses.

## Features

- Add, edit, and delete transactions
- Track income and expenses
- View statistics (total income, expenses, balance)
- Search transactions using regex patterns
- Sort by date, amount, or category
- Multi-currency support (USD, EUR, RWF)
- Set monthly budget caps
- Export/Import data as JSON
- Auto-save to localStorage

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/IREMY250/Summative-Assignment_front_end.git
   ```

2. Open `index.html` in your browser

## Usage

### Add Transaction

Fill in the form with description, amount, category, date, and type. Click "Add Transaction".

### Edit Transaction

Click "Edit" on any transaction, modify the fields, and click "Update".

### Delete Transaction

Click "Delete" on any transaction and confirm.

### Search

Enter a regex pattern in the search box to filter transactions.

### Currency

Click Settings to change conversion rates. Use USD/EUR/RWF buttons to switch currency.

### Export/Import

Click "Export" to download data as JSON. Click "Import" to load data from a JSON file.

## Data Structure

```javascript
{
  id: "rec_0001",
  description: "Lunch at cafeteria",
  amount: 12.50,
  category: "Food",
  date: "2025-09-29",
  type: "expense",
  createdAt: "2025-10-17T10:30:00.000Z",
  updatedAt: "2025-10-17T10:30:00.000Z"
}
```

## Validation Rules

- **Description**: `/^\S(?:.*\S)?$/` - No leading/trailing spaces, no duplicate words
- **Amount**: `/^(0|[1-9]\d*)(\.\d{1,2})?$/` - Positive number with max 2 decimals
- **Date**: `/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/` - YYYY-MM-DD format
- **Category**: `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` - Letters, spaces, hyphens only

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- localStorage API
- Regular Expressions

## License

MIT License

## Author

IREMY - [GitHub](https://github.com/IREMY250)
