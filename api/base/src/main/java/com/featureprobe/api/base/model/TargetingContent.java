package com.featureprobe.api.base.model;

import com.featureprobe.api.base.util.JsonMapper;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
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

    @Schema(description = "Precondition for toggle.")
    @NotNull
    private List<PrerequisiteModel> prerequisites;

    public static TargetingContent newDefault(String variations, Integer disabledServe) {
        TargetingContent toggleContentModel = new TargetingContent();
        toggleContentModel.setRules(new ArrayList<>());
        toggleContentModel.setVariations(JsonMapper.toListObject(variations, Variation.class));
        toggleContentModel.setDisabledServe(ServeValue.createSelect(disabledServe));
        toggleContentModel.setDefaultServe(new ServeValue());
        toggleContentModel.setPrerequisites(Collections.emptyList());
        return toggleContentModel;
    }

    public String toJson() {
        return JsonMapper.toJSONString(this);
    }

    public List<Object> getVariationObjectsByConverter(Variation.ValueConverter variationValueConverter) {
        return this.variations.stream().map(variation ->
                variationValueConverter.convert(variation.getValue())).collect(Collectors.toList());
    }

    public List<com.featureprobe.sdk.server.model.Prerequisite> getPrerequisiteByConverter(
            Map<String, Variation.ValueConverter<?>> converters) {
        if (Objects.isNull(prerequisites)) return Collections.emptyList();
        return this.prerequisites.stream().map(prerequisiteModel ->
                buildSdkPrerequisite(converters.get(prerequisiteModel.getType()), prerequisiteModel))
                .collect(Collectors.toList());
    }

    private com.featureprobe.sdk.server.model.Prerequisite buildSdkPrerequisite(
            Variation.ValueConverter variationValueConverter, PrerequisiteModel prerequisiteModel) {
        com.featureprobe.sdk.server.model.Prerequisite prerequisite =
                new com.featureprobe.sdk.server.model.Prerequisite();
        prerequisite.setKey(prerequisiteModel.getKey());
        prerequisite.setValue(variationValueConverter.convert(prerequisiteModel.getValue()));
        return prerequisite;
    }
}
