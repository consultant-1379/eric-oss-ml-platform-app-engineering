import { check } from "k6";
import { checkHealthOfAllScrapePoolsUp } from "../implementations/MetricsImpl.js";


export function checkScrapePoolsHealth() {
    let allPoolsUp = checkHealthOfAllScrapePoolsUp();

    if(!check(allPoolsUp, {
        ["All scrape pools should be up"]: (r) => {
            return r === true;
        }}, { legacy: "false" })
    ) {
        console.error("The health of some scrape pools is 'down'.");
    }
}