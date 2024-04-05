"use client";

import React from "react";
import { getAllData } from "../lib/server";
import { Tabs } from "@mantine/core";

import { TurboContext } from "../lib/context";
import { TBA_KEY } from "../lib/tba_api";
import { ProgressTab } from "./progress";
import { EntryTab } from "./entries";
import { TeamsTab } from "./teams";
import { ExportTab } from "./export";
import { AllianceSplitTab } from "./alliancesplit";

export default function ViewDataPage() {

    const { currentEvent } = React.useContext(TurboContext);
    const [data, setData] = React.useState<any[]>([]);
    const [tbaData, setTbaData] = React.useState<any[]>([]);

    React.useEffect(() => {
        getAllData(setData);
    }, []);

    React.useEffect(() => {
        if (currentEvent == undefined) return;

        const kv_pairs = {
            "insights": `https://www.thebluealliance.com/api/v3/event/${currentEvent}/insights`,
            "oprs": `https://www.thebluealliance.com/api/v3/event/${currentEvent}/oprs`,
            "rankings": `https://www.thebluealliance.com/api/v3/event/${currentEvent}/rankings`,
            "matches": `https://www.thebluealliance.com/api/v3/event/${currentEvent}/matches`
        };

        let resultant: any = {};

        Object.entries(kv_pairs).forEach(async ([key, url]) => {
            console.log(`${key} <-- ${url}`);

            fetch(url, { headers: { "X-TBA-Auth-Key": TBA_KEY } }).then(r => r.json()).then((data: any) => {
                resultant[key] = data;

                if (Object.values(resultant).length == Object.values(kv_pairs).length) {
                    setTbaData(resultant);
                    console.log("Done loading TBA data!");
                }
            });
        });

    }, [currentEvent, setTbaData]);

    //TODO: statbotics

    const tabs = {
        /**
         * Ideas:
         *  Visual pit map display
         *  Charts and stuff
         *  Individual team
         *  Match
         *  Alliance view?
         *  Export as CSV/XLSX
         */
        "Pit Progress": <ProgressTab data={data} tbaData={tbaData} />,
        "Entries": <EntryTab data={data} />,
        "Teams": <TeamsTab data={data} tbaData={tbaData} />,
        "Alliance Display": <AllianceSplitTab data={data} tbaData={tbaData} />,
        "Export": <ExportTab data={data} />
    };

    return <Tabs variant="outline" defaultValue={Object.keys(tabs)[0]}>
        <Tabs.List>
            {Object.keys(tabs).map(label => {
                return <Tabs.Tab value={label} key={label}>
                    {label}
                </Tabs.Tab>
            })}

        </Tabs.List>

        {Object.entries(tabs).map(([label, content]) => {
            return <Tabs.Panel value={label} key={label}>
                {content}
            </Tabs.Panel>
        })}
    </Tabs>
}