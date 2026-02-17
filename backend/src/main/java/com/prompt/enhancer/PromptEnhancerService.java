package com.prompt.enhancer;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.Map;

@Service
public class PromptEnhancerService {

    private final WebClient webClient;

    @Value("${openrouter.api.url}")
    private String openRouterApiUrl;

    @Value("${openrouter.api.key}")
    private String openRouterApiKey;

    public PromptEnhancerService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String enhancePrompt (PromptRequest promptRequest) {

        String prompt = buildEnhancedPrompt(promptRequest);

        Map<String, Object> requestBody = Map.of(
                "model", "google/gemma-3-12b-it:free",
                "messages", new Object[] {
                        Map.of(
                                "role", "user",
                                "content", prompt
                        )
                },
                "max_tokens", 3500,
                "temperature", 0.4
        );

        String response = webClient.post()
                .uri(openRouterApiUrl)
                .header("Authorization", "Bearer " + openRouterApiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return extractResponseContent(response);
    }

    private String extractResponseContent(String response) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response);

            return rootNode.path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText();

        } catch(Exception e) {
            return "Error processing request " + e.getMessage();
        }
    }


    private String buildEnhancedPrompt(PromptRequest promptRequest) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("""
You are an expert AI prompt engineer.

Enhance and rewrite the following prompt to improve:
- clarity
- effectiveness
- structure
- AI reasoning performance

Return ONLY the improved prompt, Please do not generate anything other it.

Original Prompt:
""");
        prompt.append(promptRequest.getRawPrompt());

        return prompt.toString();
    }

}
