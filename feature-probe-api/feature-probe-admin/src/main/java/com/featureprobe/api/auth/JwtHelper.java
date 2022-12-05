package com.featureprobe.api.auth;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.algorithms.Algorithm;
import com.featureprobe.api.base.model.OrganizationMemberModel;
import com.featureprobe.api.base.util.JsonMapper;

import java.time.Instant;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public class JwtHelper {

    private static final String ACCOUNT_KEY = "account";
    private static final String USER_ID_KEY = "userId";
    private static final String ORGANIZATIONS = "organizations";
    public static final String AUTHORITIES_CLAIM_NAME = "role";

    public static String createJwtForMember(JwtConfiguration configuration,
                                            AuthenticatedMember member,
                                            List<OrganizationMemberModel> organizations,
                                            String roleName) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(Instant.now().toEpochMilli());
        calendar.add(Calendar.HOUR, 12);
        JWTCreator.Builder jwtBuilder = JWT.create().withSubject(member.getName());
        jwtBuilder.withClaim(ACCOUNT_KEY, member.getName());
        jwtBuilder.withClaim(USER_ID_KEY, member.getId());
        Map<Long, OrganizationMemberModel> organizationMemberModelMap = organizations.stream().collect(Collectors
                .toMap(OrganizationMemberModel::getOrganizationId, Function.identity()));
        jwtBuilder.withClaim(ORGANIZATIONS, JsonMapper.toJSONString(organizationMemberModelMap));
        jwtBuilder.withClaim(AUTHORITIES_CLAIM_NAME, roleName);

        return jwtBuilder
                .withNotBefore(new Date())
                .withExpiresAt(calendar.getTime())
                .sign(Algorithm.RSA256(configuration.getRsaPublicKey(), configuration.getRsaPrivateKey()));
    }

}
