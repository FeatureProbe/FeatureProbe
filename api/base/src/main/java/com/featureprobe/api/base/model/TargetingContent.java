package com.featureprobe.api.base.model;

import com.featureprobe.api.base.util.JsonMapper;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Schema(description = "This is where you can express complex rules on attributes with conditions and operators. " +
        "<br/> rules、disabledServe、defaultServe、variations support independent update.")
public class TargetingContent {

    @Schema(description = "Server a variation to specific users based on their attributes. " +
            "<br/> **Use OR(|) operation between multiple rules.**")
    private List<ToggleRule> rules;

    @NotNull
    private ServeValue disabledServe;

    @NotNull
    private ServeValue defaultServe;

    @Schema(description = "Variations decide the toggles return value in you code.")
    @NotNull
    private List<Variation> variations;

    public static TargetingContent newDefault(String variations, Integer disabledServe) {
        TargetingContent toggleContentModel = new TargetingContent();
        toggleContentModel.setRules(new ArrayList<>());
        toggleContentModel.setVariations(JsonMapper.toListObject(variations, Variation.class));
        toggleContentModel.setDisabledServe(ServeValue.createSelect(disabledServe));
        toggleContentModel.setDefaultServe(new ServeValue());
        return toggleContentModel;
    }

    public String toJson() {
        return JsonMapper.toJSONString(this);
    }

    public List<Object> getVariationObjectsByConverter(Variation.ValueConverter variationValueConverter) {
        return this.variations.stream().map(variation ->
                variationValueConverter.convert(variation.getValue())).collect(Collectors.toList());
    }
}
