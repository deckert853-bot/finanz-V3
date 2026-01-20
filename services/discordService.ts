
import { Profile, CalcResult } from '../types';

const fmtUSD = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export const sendDiscordReport = async (
  webhookUrls: string[], 
  profile: Profile, 
  results: CalcResult, 
  userDisplay: string
): Promise<boolean> => {
  const lines = results.filteredEntries.slice(0, 15).map(e => 
    `• \`${e.date}\` **${e.desc}**: ${e.type === 'Einnahme' ? '+' : '-'}${fmtUSD(e.amount)}`
  ).join("\n") || "_Keine Einträge im Zeitraum_";

  const payload = {
    embeds: [{
      title: `📊 Finanzbericht: ${profile.name}`,
      color: results.net >= 0 ? 3066993 : 15158332,
      description: `Zusammenfassung für den Zeitraum: **${profile.monthFilter || 'Gesamt'}**`,
      fields: [
        { name: "Gesamt Einnahmen", value: `\`${fmtUSD(results.inc)}\``, inline: true },
        { name: "Gesamt Ausgaben", value: `\`${fmtUSD(results.exp)}\``, inline: true },
        { name: "Steuern", value: `\`${fmtUSD(results.tax)}\` (${profile.taxRate}%)`, inline: true },
        { name: "Netto-Ergebnis", value: `**${fmtUSD(results.net)}**`, inline: false },
        { name: "Transaktionen (Top 15)", value: lines }
      ],
      footer: { text: `Erstellt von: ${userDisplay} | ${new Date().toLocaleString()}` }
    }]
  };

  let atLeastOneSuccess = false;
  for (const url of webhookUrls) {
    if (!url || !url.startsWith("http")) continue;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) atLeastOneSuccess = true;
    } catch (e) {
      console.error("Discord send error:", e);
    }
  }
  return atLeastOneSuccess;
};
