'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface Country {
  code: string;
  name: string;
  blocked: boolean;
}

const COUNTRIES: Country[] = [
    { code: 'US', name: 'United States', blocked: false },
    { code: 'GB', name: 'United Kingdom', blocked: false },
    { code: 'CI', name: 'Cote DIvoire', blocked: false },
    { code: 'AF', name: 'Afghanistan', blocked: false },
    { code: 'AL', name: 'Albania', blocked: false },
    { code: 'DZ', name: 'Algeria', blocked: false },
    { code: 'AD', name: 'Andorra', blocked: false },
    { code: 'AO', name: 'Angola', blocked: false },
    { code: 'AG', name: 'Antigua and Barbuda', blocked: false },
    { code: 'AR', name: 'Argentina', blocked: false },
    { code: 'AM', name: 'Armenia', blocked: false },
    { code: 'AU', name: 'Australia', blocked: false },
    { code: 'AT', name: 'Austria', blocked: false },
    { code: 'AZ', name: 'Azerbaijan', blocked: false },
    { code: 'BS', name: 'Bahamas', blocked: false },
    { code: 'BH', name: 'Bahrain', blocked: false },
    { code: 'BD', name: 'Bangladesh', blocked: false },
    { code: 'BB', name: 'Barbados', blocked: false },
    { code: 'BY', name: 'Belarus', blocked: false },
    { code: 'BE', name: 'Belgium', blocked: false },
    { code: 'BZ', name: 'Belize', blocked: false },
    { code: 'BJ', name: 'Benin', blocked: false },
    { code: 'BT', name: 'Bhutan', blocked: false },
    { code: 'BO', name: 'Bolivia', blocked: false },
    { code: 'BA', name: 'Bosnia and Herzegovina', blocked: false },
    { code: 'BW', name: 'Botswana', blocked: false },
    { code: 'BR', name: 'Brazil', blocked: false },
    { code: 'BN', name: 'Brunei', blocked: false },
    { code: 'BG', name: 'Bulgaria', blocked: false },
    { code: 'BF', name: 'Burkina Faso', blocked: false },
    { code: 'BI', name: 'Burundi', blocked: false },
    { code: 'CV', name: 'Cabo Verde', blocked: false },
    { code: 'KH', name: 'Cambodia', blocked: false },
    { code: 'CM', name: 'Cameroon', blocked: false },
    { code: 'CA', name: 'Canada', blocked: false },
    { code: 'CF', name: 'Central African Republic', blocked: false },
    { code: 'TD', name: 'Chad', blocked: false },
    { code: 'CL', name: 'Chile', blocked: false },
    { code: 'CN', name: 'China', blocked: false },
    { code: 'CO', name: 'Colombia', blocked: false },
    { code: 'KM', name: 'Comoros', blocked: false },
    { code: 'CD', name: 'Congo, Democratic Republic of the', blocked: false },
    { code: 'CG', name: 'Congo', blocked: false },
    { code: 'CR', name: 'Costa Rica', blocked: false },
    { code: 'HR', name: 'Croatia', blocked: false },
    { code: 'CU', name: 'Cuba', blocked: false },
    { code: 'CY', name: 'Cyprus', blocked: false },
    { code: 'CZ', name: 'Czechia', blocked: false },
    { code: 'DK', name: 'Denmark', blocked: false },
    { code: 'DJ', name: 'Djibouti', blocked: false },
    { code: 'DM', name: 'Dominica', blocked: false },
    { code: 'DO', name: 'Dominican Republic', blocked: false },
    { code: 'EC', name: 'Ecuador', blocked: false },
    { code: 'EG', name: 'Egypt', blocked: false },
    { code: 'SV', name: 'El Salvador', blocked: false },
    { code: 'GQ', name: 'Equatorial Guinea', blocked: false },
    { code: 'ER', name: 'Eritrea', blocked: false },
    { code: 'EE', name: 'Estonia', blocked: false },
    { code: 'SZ', name: 'Eswatini', blocked: false },
    { code: 'ET', name: 'Ethiopia', blocked: false },
    { code: 'FJ', name: 'Fiji', blocked: false },
    { code: 'FI', name: 'Finland', blocked: false },
    { code: 'FR', name: 'France', blocked: false },
    { code: 'GA', name: 'Gabon', blocked: false },
    { code: 'GM', name: 'Gambia', blocked: false },
    { code: 'GE', name: 'Georgia', blocked: false },
    { code: 'DE', name: 'Germany', blocked: false },
    { code: 'GH', name: 'Ghana', blocked: false },
    { code: 'GR', name: 'Greece', blocked: false },
    { code: 'GD', name: 'Grenada', blocked: false },
    { code: 'GT', name: 'Guatemala', blocked: false },
    { code: 'GN', name: 'Guinea', blocked: false },
    { code: 'GW', name: 'Guinea-Bissau', blocked: false },
    { code: 'GY', name: 'Guyana', blocked: false },
    { code: 'HT', name: 'Haiti', blocked: false },
    { code: 'HN', name: 'Honduras', blocked: false },
    { code: 'HU', name: 'Hungary', blocked: false },
    { code: 'IS', name: 'Iceland', blocked: false },
    { code: 'IN', name: 'India', blocked: false },
    { code: 'ID', name: 'Indonesia', blocked: false },
    { code: 'IR', name: 'Iran', blocked: false },
    { code: 'IQ', name: 'Iraq', blocked: false },
    { code: 'IE', name: 'Ireland', blocked: false },
    { code: 'IL', name: 'Israel', blocked: false },
    { code: 'IT', name: 'Italy', blocked: false },
    { code: 'JM', name: 'Jamaica', blocked: false },
    { code: 'JP', name: 'Japan', blocked: false },
    { code: 'JO', name: 'Jordan', blocked: false },
    { code: 'KZ', name: 'Kazakhstan', blocked: false },
    { code: 'KE', name: 'Kenya', blocked: false },
    { code: 'KI', name: 'Kiribati', blocked: false },
    { code: 'KP', name: 'North Korea', blocked: false },
    { code: 'KR', name: 'South Korea', blocked: false },
    { code: 'XK', name: 'Kosovo', blocked: false },
    { code: 'KG', name: 'Kyrgyzstan', blocked: false },
    { code: 'LA', name: 'Laos', blocked: false },
    { code: 'LV', name: 'Latvia', blocked: false },
    { code: 'LB', name: 'Lebanon', blocked: false },
    { code: 'LS', name: 'Lesotho', blocked: false },
    { code: 'LR', name: 'Liberia', blocked: false },
    { code: 'LY', name: 'Libya', blocked: false },
    { code: 'LI', name: 'Liechtenstein', blocked: false },
    { code: 'LT', name: 'Lithuania', blocked: false },
    { code: 'LU', name: 'Luxembourg', blocked: false },
    { code: 'MG', name: 'Madagascar', blocked: false },
    { code: 'MW', name: 'Malawi', blocked: false },
    { code: 'MY', name: 'Malaysia', blocked: false },
    { code: 'MV', name: 'Maldives', blocked: false },
    { code: 'ML', name: 'Mali', blocked: false },
    { code: 'MT', name: 'Malta', blocked: false },
    { code: 'MH', name: 'Marshall Islands', blocked: false },
    { code: 'MR', name: 'Mauritania', blocked: false },
    { code: 'MU', name: 'Mauritius', blocked: false },
    { code: 'MX', name: 'Mexico', blocked: false },
    { code: 'FM', name: 'Micronesia', blocked: false },
    { code: 'MD', name: 'Moldova', blocked: false },
    { code: 'MC', name: 'Monaco', blocked: false },
    { code: 'MN', name: 'Mongolia', blocked: false },
    { code: 'ME', name: 'Montenegro', blocked: false },
    { code: 'MA', name: 'Morocco', blocked: false },
    { code: 'MZ', name: 'Mozambique', blocked: false },
    { code: 'MM', name: 'Myanmar', blocked: false },
    { code: 'NA', name: 'Namibia', blocked: false },
    { code: 'NR', name: 'Nauru', blocked: false },
    { code: 'NP', name: 'Nepal', blocked: false },
    { code: 'NL', name: 'Netherlands', blocked: false },
    { code: 'NZ', name: 'New Zealand', blocked: false },
    { code: 'NI', name: 'Nicaragua', blocked: false },
    { code: 'NE', name: 'Niger', blocked: false },
    { code: 'NG', name: 'Nigeria', blocked: false },
    { code: 'MK', name: 'North Macedonia', blocked: false },
    { code: 'NO', name: 'Norway', blocked: false },
    { code: 'OM', name: 'Oman', blocked: false },
    { code: 'PK', name: 'Pakistan', blocked: false },
    { code: 'PW', name: 'Palau', blocked: false },
    { code: 'PS', name: 'Palestine', blocked: false },
    { code: 'PA', name: 'Panama', blocked: false },
    { code: 'PG', name: 'Papua New Guinea', blocked: false },
    { code: 'PY', name: 'Paraguay', blocked: false },
    { code: 'PE', name: 'Peru', blocked: false },
    { code: 'PH', name: 'Philippines', blocked: false },
    { code: 'PL', name: 'Poland', blocked: false },
    { code: 'PT', name: 'Portugal', blocked: false },
    { code: 'QA', name: 'Qatar', blocked: false },
    { code: 'RO', name: 'Romania', blocked: false },
    { code: 'RU', name: 'Russia', blocked: false },
    { code: 'RW', name: 'Rwanda', blocked: false },
    { code: 'KN', name: 'Saint Kitts and Nevis', blocked: false },
    { code: 'LC', name: 'Saint Lucia', blocked: false },
    { code: 'VC', name: 'Saint Vincent and the Grenadines', blocked: false },
    { code: 'WS', name: 'Samoa', blocked: false },
    { code: 'SM', name: 'San Marino', blocked: false },
    { code: 'ST', name: 'Sao Tome and Principe', blocked: false },
    { code: 'SA', name: 'Saudi Arabia', blocked: false },
    { code: 'SN', name: 'Senegal', blocked: false },
    { code: 'RS', name: 'Serbia', blocked: false },
    { code: 'SC', name: 'Seychelles', blocked: false },
    { code: 'SL', name: 'Sierra Leone', blocked: false },
    { code: 'SG', name: 'Singapore', blocked: false },
    { code: 'SK', name: 'Slovakia', blocked: false },
    { code: 'SI', name: 'Slovenia', blocked: false },
    { code: 'SB', name: 'Solomon Islands', blocked: false },
    { code: 'SO', name: 'Somalia', blocked: false },
    { code: 'ZA', name: 'South Africa', blocked: false },
    { code: 'SS', name: 'South Sudan', blocked: false },
    { code: 'ES', name: 'Spain', blocked: false },
    { code: 'LK', name: 'Sri Lanka', blocked: false },
    { code: 'SD', name: 'Sudan', blocked: false },
    { code: 'SR', name: 'Suriname', blocked: false },
    { code: 'SE', name: 'Sweden', blocked: false },
    { code: 'CH', name: 'Switzerland', blocked: false },
    { code: 'SY', name: 'Syria', blocked: false },
    { code: 'TW', name: 'Taiwan', blocked: false },
    { code: 'TJ', name: 'Tajikistan', blocked: false },
    { code: 'TZ', name: 'Tanzania', blocked: false },
    { code: 'TH', name: 'Thailand', blocked: false },
    { code: 'TL', name: 'Timor-Leste', blocked: false },
    { code: 'TG', name: 'Togo', blocked: false },
    { code: 'TO', name: 'Tonga', blocked: false },
    { code: 'TT', name: 'Trinidad and Tobago', blocked: false },
    { code: 'TN', name: 'Tunisia', blocked: false },
    { code: 'TR', name: 'Turkey', blocked: false },
    { code: 'TM', name: 'Turkmenistan', blocked: false },
    { code: 'TV', name: 'Tuvalu', blocked: false },
    { code: 'UG', name: 'Uganda', blocked: false },
    { code: 'UA', name: 'Ukraine', blocked: false },
    { code: 'AE', name: 'United Arab Emirates', blocked: false },
    { code: 'UY', name: 'Uruguay', blocked: false },
    { code: 'UZ', name: 'Uzbekistan', blocked: false },
    { code: 'VU', name: 'Vanuatu', blocked: false },
    { code: 'VE', name: 'Venezuela', blocked: false },
    { code: 'VN', name: 'Vietnam', blocked: false },
    { code: 'YE', name: 'Yemen', blocked: false },
    { code: 'ZM', name: 'Zambia', blocked: false },
    { code: 'ZW', name: 'Zimbabwe', blocked: false }
];

export function BlockedCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlockedCountries();
  }, []);

  async function loadBlockedCountries() {
    try {
      const { data: blockedCountries, error } = await supabase
        .from('blocked_countries')
        .select('country_code');

      if (error) throw error;

      const blockedCodes = new Set(blockedCountries.map(c => c.country_code));
      
      setCountries(
        COUNTRIES.map(country => ({
          ...country,
          blocked: blockedCodes.has(country.code)
        }))
      );
    } catch (error) {
      console.error('Error loading blocked countries:', error);
      toast.error('Failed to load blocked countries');
    } finally {
      setLoading(false);
    }
  }

  async function toggleCountry(countryCode: string, blocked: boolean) {
    try {
      if (blocked) {
        const country = COUNTRIES.find(c => c.code === countryCode);
        if (!country) return;

        const { error } = await supabase
          .from('blocked_countries')
          .insert({
            country_code: countryCode,
            country_name: country.name,
            blocked_at: new Date().toISOString()
          });

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blocked_countries')
          .delete()
          .eq('country_code', countryCode);

        if (error) throw error;
      }

      setCountries(prev =>
        prev.map(country =>
          country.code === countryCode
            ? { ...country, blocked }
            : country
        )
      );

      toast.success(
        blocked
          ? `${countryCode} has been blocked`
          : `${countryCode} has been unblocked`
      );
    } catch (error) {
      console.error('Error updating country status:', error);
      toast.error('Failed to update country status');
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blocked Countries</CardTitle>
        <CardDescription>
          Manage which countries are blocked from accessing your website
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {countries.map((country) => (
              <div
                key={country.code}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center space-x-4">
                  <span>{country.name}</span>
                </div>
                <Switch
                  checked={country.blocked}
                  onCheckedChange={(checked) => toggleCountry(country.code, checked)}
                  disabled={loading}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
