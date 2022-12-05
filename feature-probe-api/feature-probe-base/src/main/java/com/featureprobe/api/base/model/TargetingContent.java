package com.featureprobe.api.base.model;

import com.featureprobe.api.base.util.JsonMapper;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class TargetingContent {

    private List<ToggleRule> rules;
    private ServeValue disabledServe;
    private ServeValue defaultServe;
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
