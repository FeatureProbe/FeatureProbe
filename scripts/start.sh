#!/bin/bash

deployServer() {
   echo "FeatureProbe Server starting deploy."
   /usr/local/bin/feature_probe_server
   check_num=0
	while true; do
		status_code=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:${FP_SERVER_PORT}/internal/all_secrets")
		if [[ $status_code == 200 ]]; then
		    echo "FeatureProbe Server deplay successfully."
		    exit 0
		elif [[ $check_num == 150 ]];then
			echo "FeatureProbe Server deployment fail."
			exit 1
		fi
		sleep 2
		((check_num++))
		echo "FeatureProbe Server deployment in progress..."
	done
}

deployAnalysis() {
    echo "FeatureProbe Analysis starting deploy."
    java ${ANALYSIS_JVM_ARGS} -jar /usr/local/bin/analysis.jar --server.port=${analysis_server_port} --spring.profiles.active=${analysis_spring_profiles_active} &
    check_num=0
	while true; do
		status_code=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:${analysis_server_port}/analysis?metric=name&toggle=zp_test&type=binomial&start=1676517701000&end=1676519469152" --header "Authorization: 1111")
		if [[ $status_code == 200 ]]; then
		    echo "FeatureProbe Analysis deplay successfully."
		    if [[ $1 == 0 ]];then
		    	deployServer
			fi		   
		    exit 0
		elif [[ $check_num == 150 ]];then
			echo "FeatureProbe Analysis deployment fail."
			exit 1
		fi
		((check_num++))
		sleep 2
		echo "FeatureProbe Analysis deployment in progress..."
	done
}

deployApi() {
    java ${API_JVM_ARGS} -jar /usr/local/bin/api.jar --server.port=${api_server_port} --spring.profiles.active=${api_spring_profiles_active} & 
    check_num=0
    while true; do
        status_code=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:${api_server_port}/actuator/health")
        if [[ $status_code == 200 ]]; then
            echo "FeatureProbe API deplay successfully."
            if [[ $1 == 0 ]];then
                deployAnalysis 0
                
            fi		   
            exit 0
        elif [[ $check_num == 150 ]];then
            echo "FeatureProbe API deployment fail."
            exit 1
        fi
        ((check_num++))
        sleep 2
        echo "FeatureProbe API deployment in progress..."
    done
}

deployApi 0
exit 1;
