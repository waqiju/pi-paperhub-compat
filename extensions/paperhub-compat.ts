import type { ExtensionAPI, ExtensionContext } from "@mariozechner/pi-coding-agent";

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasReasoningRequest(payload: JsonObject): boolean {
	if (typeof payload.reasoning_effort === "string" && payload.reasoning_effort.length > 0) {
		return true;
	}

	const reasoning = payload.reasoning;
	return isObject(reasoning) && typeof reasoning.effort === "string" && reasoning.effort.length > 0;
}

function shouldEnableReasoning(payload: JsonObject, ctx: ExtensionContext, pi: ExtensionAPI): boolean {
	if (hasReasoningRequest(payload)) {
		return true;
	}

	return ctx.model?.provider === "paperhub" && ctx.model.reasoning === true && pi.getThinkingLevel() !== "off";
}

export default function (pi: ExtensionAPI) {
	pi.on("before_provider_request", (event, ctx) => {
		if (ctx.model?.provider !== "paperhub" || !isObject(event.payload)) {
			return;
		}

		const payload = { ...event.payload };
		const enableReasoning = shouldEnableReasoning(payload, ctx, pi);

		delete payload.reasoning_effort;

		if (!enableReasoning) {
			if (isObject(payload.reasoning) && "effort" in payload.reasoning) {
				const reasoning = { ...payload.reasoning };
				delete reasoning.effort;
				payload.reasoning = reasoning;
			}
			return payload;
		}

		payload.reasoning = { enabled: true };
		return payload;
	});
}
