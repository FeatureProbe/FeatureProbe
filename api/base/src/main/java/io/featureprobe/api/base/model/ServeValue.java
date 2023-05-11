package io.featureprobe.api.base.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.featureprobe.sdk.server.model.Serve;
import com.featureprobe.sdk.server.model.Split;
import com.google.common.collect.Lists;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "Define the return value. <br/> Just provide one of 'select' and 'split'. ")
public class ServeValue {

    @Schema(description = "Define the return variation index.")
    private Integer select;

    @Schema(description = "Variations rollout by percentage. <br/> Accuracy is ten thousand. " +
            "<br/> Example: [5000, 5000] means the percentages are 50% each.")
    private List<Integer> split;

    ServeValue(Integer select) {
        this.select = select;
    }

    ServeValue(List<Integer> split) {
        this.split = split;
    }

    public static ServeValue createSelect(Integer select) {
        return new ServeValue(select);
    }

    public static ServeValue createSplit(List<Integer> split) {
        return new ServeValue(split);
    }

    public Serve toServe() {
        if (this.isSplitServe()) {
            return new Serve(this.toDistributionSplit());
        } else if (this.getSelect() != null) {
            return new Serve(this.getSelect());
        } else {
            return null;
        }
    }

    @JsonIgnore
    protected boolean isSplitServe() {
        return split != null && split.size() > 0;
    }

    protected Split toDistributionSplit() {
        if (!isSplitServe()) {
            return null;
        }
        List<List<List<Integer>>> distribution = Lists.newArrayList();

        int end = 0;
        for (int i = 0; i < split.size(); i++) {
            int start = end;
            end += split.get(i);
            distribution.add(makePairs(start, end));
        }
        return new Split(distribution);
    }

    private List<List<Integer>> makePairs(Integer start, Integer end) {
        List<List<Integer>> pairs = Lists.newArrayList();
        pairs.add(Lists.newArrayList(start, end));
        return pairs;
    }
}
