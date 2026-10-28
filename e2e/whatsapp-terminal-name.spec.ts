import { expect, test } from "@playwright/test";
import { installFixtureRoutes } from "./support/browser";

test("WhatsApp search and message history show the confirmed Hebrew name", async ({
  page,
}) => {
  test.skip(!!process.env.BASE_URL, "This regression uses the local fixture server");
  await installFixtureRoutes(page);
  const response = await page.goto("/projects/whatsapp-mcp", { waitUntil: "load" });
  expect(response?.status()).toBe(200);

  const panel = page.getByRole("tabpanel");
  const search = page.getByRole("tab", { name: /search/ });
  await search.click();
  await expect(search).toHaveAttribute("aria-selected", "true");
  await expect(panel.getByText("איתן היימן", { exact: true })).toBeVisible();
  await expect(panel).not.toContainText("אתן");
  await expect(panel).toContainText("972501234567@s.whatsapp.net");
  await expect(panel).toContainText("972521234567@s.whatsapp.net");

  const messages = page.getByRole("tab", { name: /messages/ });
  await messages.click();
  await expect(messages).toHaveAttribute("aria-selected", "true");
  const senders = panel.getByText("איתן", { exact: true });
  await expect(senders).toHaveCount(2);
  await expect(senders.nth(0)).toBeVisible();
  await expect(senders.nth(1)).toBeVisible();
  await expect(panel).not.toContainText("אתן");
  await expect(panel).toContainText("מה קורה עם הפרויקט?");
  await expect(panel).toContainText("אחלה אחי!");
  await expect(panel).toContainText("972521234567@s.whatsapp.net");
});
