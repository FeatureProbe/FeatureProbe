package com.featureprobe.api.base.doc;

import com.featureprobe.api.base.model.BaseResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@ApiResponses({
        @ApiResponse(responseCode = "403", description = "Forbidden", content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = BaseResponse.class)
        )
        ),
        @ApiResponse(responseCode = "404", description = "Invalid resource identifier", content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = BaseResponse.class)
        )),
        @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = BaseResponse.class)
        )),
})
public @interface DefaultApiResponses {

}
