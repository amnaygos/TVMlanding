## 0. Database Configuration (Prerequisite)
Before the landing pages can submit leads, you MUST run this SQL script in the **Supabase SQL Editor** to allow public submissions:

```sql
-- Allow public (unauthenticated) users to insert leads
CREATE POLICY "Allow public lead submission" 
ON public.leads 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
```

---

## 1. Database Schema Overview
Leads are stored in the `leads` table. Every submission MUST include a `brand_id` and should ideally include a `form_code` to track the source.

### Table: `leads`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key (Auto-generated) |
| `full_name` | Text | Customer's full name |
| `phone_number` | Text | Customer's contact number |
| `form_code` | Text | Unique identifier for the specific landing page (e.g., 'SUMMER_SALES_2024') |
| `brand_id` | UUID | **Required.** The ID of the brand this lead belongs to. |
| `status` | Text | Default: 'New'. (Other options: Viewed, Contacted, Converted, Lost) |
| `metadata` | JSONB | **Flexible data.** Use this for any custom form fields. |
| `created_at` | Timestamptz | Auto-generated timestamp. |

---

## 2. The JSONB `metadata` Column
The `metadata` column is designed to store any supplemental data that doesn't fit into the standard columns (e.g., "Best time to call", "Product interest", "Customer Note").

**JSON Example:**
```json
{
  "best_time_to_call": "After 6 PM",
  "interested_in": "Premium Plan",
  "company_size": "50-100",
  "utm_source": "facebook_ads"
}
```

---

## 3. Implementation (Web SDK)

### Step 1: Install Supabase
```bash
npm install @supabase/supabase-js
```

### Step 2: Initialize Client
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://145.79.10.32:8000'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'

const supabase = createClient(supabaseUrl, supabaseKey)
```

### Step 3: Submission Function
```javascript
async function submitLead(formData) {
  // Use the brand ID from environment variables
  const brandId = process.env.NEXT_PUBLIC_BRAND_ID;

  if (!brandId) {
    console.error('Brand ID is missing from environment variables');
    return false;
  }

  const { data, error } = await supabase
    .from('leads')
    .insert([
      {
        full_name: formData.name,
        phone_number: formData.phone,
        brand_id: brandId,
        form_code: 'LP_CONTACT_V1',
        status: 'New',
        metadata: {
          message: formData.message,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          referral: document.referrer
        }
      }
    ])

  if (error) {
    console.error('Submission Error:', error)
    return false
  }
  
  return true
}
```

---

## 4. Environment Configuration
For landing pages built with Next.js or similar frameworks, add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=http://145.79.10.32:8000
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (see above)
NEXT_PUBLIC_BRAND_ID=PASTE_THE_BRAND_ID_HERE
```

---

## 5. Key Security Rules
- **RLS (Row Level Security):** Ensure that the `anon` role has `INSERT` permissions on the `leads` table.
- **Environment Variables:** Always use `NEXT_PUBLIC_BRAND_ID` to make the landing page brand-specific without hardcoding UUIDs directly into logic files.
- **Validation:** Sanitize `full_name` and `phone_number` on the client side before sending to Supabase.

## 6. Fetching Brand IDs
To find the `brand_id` for a specific landing page:
1. Log in to **MTM Leads**.
2. Go to **Brand Management**.
3. Copy the UUID shown on the brand card (e.g., `550e8400-e29b-41d4-a716-446655440000`).
