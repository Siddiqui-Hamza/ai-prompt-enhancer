package com.prompt.enhancer;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/prompt")
@AllArgsConstructor
@CrossOrigin(origins = "*")

public class PromptEnhancerController {

    private final PromptEnhancerService promptEnhancerService;

    @PostMapping("/enhance")
    public ResponseEntity<String> enhancePrompt(@RequestBody PromptRequest promptRequest) {

        String response = promptEnhancerService.enhancePrompt(promptRequest);
        return ResponseEntity.ok(response);
    }

}
