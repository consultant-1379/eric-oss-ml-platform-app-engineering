import { group } from "k6";
import { checkScrapePoolsHealth } from "../modules/checks/MetricsChecks.js";


export function validateMetrics() {

    group("Validate if metrics are correctly scraped", () => {
        group("Validate if metrics are correctly scraped", () => {
            checkScrapePoolsHealth();
        })
    })

}