package io.featureprobe.api.util


import io.featureprobe.api.base.model.PaginationRequest
import io.featureprobe.api.dao.utils.PageRequestUtil
import org.springframework.data.domain.Sort
import spock.lang.Specification

class PageRequestUtilSpec extends Specification {

    def "convert PaginationRequest to Pageable"() {
        when:
        def pageable = PageRequestUtil.toPageable(new PaginationRequest(pageIndex: 10, pageSize: 1),
                Sort.Direction.ASC, "createdAt")

        then:
        with(pageable) {
            "createdAt: ASC" == getSort().toString()
            1 == pageSize
            10 == pageNumber
        }

    }
}
