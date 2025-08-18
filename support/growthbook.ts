import "dotenv/config"
import fetch from "node-fetch";

const API_KEY = process.env.GROWTHBOOK_API_KEY! as string;
const BASE_URL = process.env.GROWTHBOOK_URL! as string;
const FEATURE_KEY = process.env.GROWTHBOOK_FEATURE_KEY! as string;

export async function getFeatureData() {
    const res = await fetch(`${BASE_URL}/features/${FEATURE_KEY}`, {
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': "application/json"
        }
    });

    if (!res.ok) throw new Error(`Failed to fetch feature: ${await res.text()}`);
    const data = await res.json();
    console.log(data);
    return data.feature;
}

export async function addUserToQuests(email: string) {
    const feature = await getFeatureData();
    const devRules = feature.environments?.dev?.rules || [];
    const rule = devRules[0];

    if (!rule) {
        console.log("No dev rules found — cannot add email.");
        return;
    }

    const conditionObj = rule.condition ? JSON.parse(rule.condition) : { id: { $in: [] } };

    if (conditionObj.id.$in.includes(email)) {
        console.log(`Email ${email} is already in dev rule — skipping update.`);
        return;
    }

    conditionObj.id.$in.push(email);
    rule.condition = JSON.stringify(conditionObj, null, 2);

    const response = await fetch(`${BASE_URL}/features/${FEATURE_KEY}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            environments: {
                dev: {
                    enabled: feature.environments.dev.enabled,
                    defaultValue: feature.environments.dev.defaultValue,
                    rules: [rule]
                }
            }
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to add user: ${await response.text()}`);
    }

    console.log(`Email ${email} added into feature ${FEATURE_KEY} in dev env`);
}

export async function deleteUserFromQuests(email: string) {
    const feature = await getFeatureData();
    const devRules = feature.environments?.dev?.rules || [];
    const rule = devRules[0];

    if (!rule) {
        console.log("No dev rules found — nothing to delete.");
        return;
    }

    const conditionObj = rule.condition ? JSON.parse(rule.condition) : { id: { $in: [] } };

    if (!conditionObj.id.$in.includes(email)) {
        console.log(`Email ${email} not found in dev rule — skipping update.`);
        return;
    }

    conditionObj.id.$in = conditionObj.id.$in.filter((e: string) => e !== email);
    rule.condition = JSON.stringify(conditionObj, null, 2);

    const response = await fetch(`${BASE_URL}/features/${FEATURE_KEY}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            environments: {
                dev: {
                    enabled: feature.environments.dev.enabled,
                    defaultValue: feature.environments.dev.defaultValue,
                    rules: [rule]
                }
            }
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to remove user: ${await response.text()}`);
    }

    console.log(`Email ${email} removed from feature ${FEATURE_KEY} in dev env`);
}