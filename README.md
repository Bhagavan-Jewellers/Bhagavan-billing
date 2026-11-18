# Bhagwan Jewellers Billing

Single-file app (`index.html`, logo built in) for GitHub Pages. Tamil / English.

## What it does
- Daily 22K / 24K / silver rates with history; share today's rate as a branded image on WhatsApp
- Enquiries with live estimate (new item minus old jewellery), convert to bill or record "not interested" reason
- Gold bill (wastage, making, stone, HUID, old gold exchange, optional GST) and silver bill
- Orders / booking (karigar, weight given, delivery date, status, "ready" WhatsApp)
- Stock with HUID and tag no; HUID in a gold bill fills the item and marks it sold
- Gold savings scheme (monthly instalments converted to grams at that day's 22K rate)
- Customers: follow-up list (enquired 3+ days ago), birthdays / anniversaries with WhatsApp wishes
- Day-wise and monthly reports with top customers
- PIN lock, backup / restore file, Google Sheet sync

## Google Sheet sync (free, no server)
1. Open sheets.google.com and create a blank sheet named "Bhagwan Billing".
2. Extensions > Apps Script. Delete what is there, paste all of `apps-script.gs`, press Save.
3. Deploy > New deployment > gear icon > Web app. Execute as: Me. Who has access: Anyone. Deploy.
4. Allow access when Google asks (Advanced > Go to project > Allow).
5. Copy the Web app URL (ends with /exec).
6. In the app: Settings > Google Sheet > paste the URL > Save URL.

The app keeps working offline and syncs when online. The full copy is in the `_backup` tab;
Bills, Enquiries, Rates, Orders, Stock, Schemes, Customers tabs are for reading.
Keep the URL private: anyone with it can write to that sheet.
