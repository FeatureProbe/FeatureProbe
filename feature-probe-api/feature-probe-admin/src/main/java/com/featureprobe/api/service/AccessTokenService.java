package com.featureprobe.api.service;

import com.featureprobe.api.auth.TokenHelper;
import com.featureprobe.api.base.db.ExcludeTenant;
import com.featureprobe.api.base.enums.AccessTokenType;
import com.featureprobe.api.base.enums.ResourceType;
import com.featureprobe.api.base.util.KeyGenerateUtil;
import com.featureprobe.api.dao.entity.AccessToken;
import com.featureprobe.api.dao.entity.Member;
import com.featureprobe.api.dao.exception.ResourceConflictException;
import com.featureprobe.api.dao.exception.ResourceNotFoundException;
import com.featureprobe.api.dao.repository.AccessTokenRepository;
import com.featureprobe.api.dao.repository.MemberRepository;
import com.featureprobe.api.dao.utils.PageRequestUtil;
import com.featureprobe.api.dto.AccessTokenCreateRequest;
import com.featureprobe.api.dto.AccessTokenResponse;
import com.featureprobe.api.dto.AccessTokenSearchRequest;
import com.featureprobe.api.dto.MemberCreateRequest;
import com.featureprobe.api.dto.TokenResponse;
import com.featureprobe.api.mapper.AccessTokenMapper;
import com.google.common.collect.Lists;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.Predicate;
import java.util.Date;
import java.util.Optional;

@AllArgsConstructor
@Service
public class AccessTokenService {

    private AccessTokenRepository accessTokenRepository;

    @PersistenceContext
    public EntityManager entityManager;

    private MemberService memberService;

    @Transactional(rollbackFor = Exception.class)
    public TokenResponse create(AccessTokenCreateRequest createRequest) {
        validateExists(createRequest.getName(), createRequest.getType());

        AccessToken accessToken = accessTokenRepository.save(newToken(createRequest));
        return new TokenResponse(accessToken.getToken());
    }

    private AccessToken newToken(AccessTokenCreateRequest createRequest) {
        AccessToken token = AccessTokenMapper.INSTANCE.requestToEntity(createRequest);
        token.setToken(KeyGenerateUtil.getAPIAccessToken());
        if (createRequest.getType() == AccessTokenType.PERSON) {
            token.setMemberId(TokenHelper.getUserId());
            token.setRole(null);
        } else {
            MemberCreateRequest memberCreateRequest = new MemberCreateRequest();
            String account = "api:" + token.getName();
            memberCreateRequest.setAccounts(Lists.newArrayList(account));
            memberCreateRequest.setPassword("DEFAULT_PASSWORD");
            memberCreateRequest.setSource("ACCESS_TOKEN");
            memberCreateRequest.setRole(createRequest.getRole());
            memberService.create(memberCreateRequest);
            Member member = memberService.findByAccount(account).get();
            token.setMemberId(member.getId());
        }
        return token;
    }

    @Transactional(rollbackFor = Exception.class)
    public AccessTokenResponse delete(Long tokenId) {
        AccessToken accessToken = getAccessTokenById(tokenId);
        accessToken.setDeleted(true);
        return AccessTokenMapper.INSTANCE.entityToResponse(accessTokenRepository.save(accessToken));
    }

    public Page<AccessTokenResponse> list(AccessTokenSearchRequest searchRequest) {
        Pageable pageable = PageRequestUtil.toCreatedTimeDescSortPageable(searchRequest);
        Page<AccessToken> tokens = accessTokenRepository.findAll(buildQuerySpec(searchRequest), pageable);
        return tokens.map(token -> AccessTokenMapper.INSTANCE.entityToResponse(token));
    }

    private Specification<AccessToken> buildQuerySpec(AccessTokenSearchRequest searchRequest) {
        return (root, query, cb) -> {
            Predicate p3 = cb.equal(root.get("type"), searchRequest.getType());
            return query.where(p3).getRestriction();
        };
    }

    public AccessTokenResponse queryById(Long tokenId) {
        return AccessTokenMapper.INSTANCE.entityToResponse(getAccessTokenById(tokenId));
    }

    private AccessToken getAccessTokenById(Long tokenId) {
        AccessToken accessToken = accessTokenRepository.findById(tokenId)
                .orElseThrow(() -> new ResourceNotFoundException(ResourceType.ACCESS_TOKEN, String.valueOf(tokenId)));
        return accessToken;
    }

    public void validateExists(String name, AccessTokenType type) {
        boolean existed = accessTokenRepository.existsByNameAndType(name, type);
        if (existed) {
            throw new ResourceConflictException(ResourceType.ACCESS_TOKEN);
        }
    }

    @ExcludeTenant
    public Optional<AccessToken> findByToken(String token) {
        return accessTokenRepository.findByToken(token);
    }

    @ExcludeTenant
    public void updateVisitedTime(Long id) {
        AccessToken accessToken = getAccessTokenById(id);
        accessToken.setVisitedTime(new Date());
        accessTokenRepository.save(accessToken);
    }
}
