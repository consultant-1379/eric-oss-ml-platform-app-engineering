{{/*
Expand the name of the chart.
*/}}
{{- define "eric-oss-ml-platform-app-test.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}
{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "eric-oss-ml-platform-app-test.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}
{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "eric-oss-ml-platform-app-test.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}
{{/*
Common labels
*/}}
{{- define "eric-oss-ml-platform-app-test.labels" -}}
helm.sh/chart: {{ include "eric-oss-ml-platform-app-test.chart" . }}
{{ include "eric-oss-ml-platform-app-test.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}
{{/*
Selector labels
*/}}
{{- define "eric-oss-ml-platform-app-test.selectorLabels" -}}
app.kubernetes.io/name: {{ include "eric-oss-ml-platform-app-test.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
{{/*
Create the name of the service account to use
*/}}
{{- define "eric-oss-ml-platform-app-test.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "eric-oss-ml-platform-app-test.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
DR-D470217-011 This helper defines the annotation which brings the service into the mesh.
*/}}
{{- define "eric-oss-ml-platform-app-test.service-mesh-ingress-enabled" -}}
{{- if (((.Values.global).serviceMesh).ingress).enabled -}}
  {{- "true" -}}
{{- else -}}
  {{- "false" -}}
{{- end -}}
{{- end -}}

{{/*
DR-D470217-007-AD This helper defines whether the service mesh is enabled or not.
*/}}
{{- define "eric-oss-ml-platform-app-test.service-mesh-enabled" }}
{{- if ((.Values.global).serviceMesh).enabled -}}
  {{- "true" -}}
{{- else -}}
  {{- "false" -}}
{{- end -}}
{{- end -}}

{{/*
Check global.security.tls.enabled since it is removed from values.yaml
*/}}
{{- define "eric-oss-ml-platform-app-test.global-security-tls-enabled" -}}
{{- if (((.Values.global).security).tls).enabled -}}
  {{- (((.Values.global).security).tls).enabled | toString -}}
{{- else -}}
  {{- "false" -}}
{{- end -}}
{{- end -}}

{{/*
Check IAM Client Credential Authentication enabling option
*/}}
{{- define "eric-oss-ml-platform-app-test.iam-client-credential-authn-enabled" -}}
{{- $serviceMesh := include "eric-oss-ml-platform-app-test.service-mesh-enabled" . | trim -}}
{{- $globalTls := include "eric-oss-ml-platform-app-test.global-security-tls-enabled" . | trim -}}
{{- $globalmTls2Iam := include "eric-oss-ml-platform-app-test.global-security-mTls2Iam-enabled" . | trim -}}
{{- if and (eq $serviceMesh "true") (eq $globalTls "true") (eq $globalmTls2Iam "true")  -}}
  {{- "true" -}}
{{- else -}}
  {{- "false" -}}
{{- end -}}
{{- end -}}

{{/*
Check mTLS to IAM enabling option
*/}}
{{- define "eric-oss-ml-platform-app-test.global-security-mTls2Iam-enabled" }}
{{- if (((.Values.global).security).mTls2Iam).enabled -}}
  {{- (((.Values.global).security).mTls2Iam).enabled | toString -}}
{{- else -}}
  {{- "false" -}}
{{- end -}}
{{- end -}}

{{/*
Define Service Account name
*/}}
{{- define "eric-oss-ml-platform-app-test.serviceaccount" -}}
  {{- $name := include "eric-oss-ml-platform-app-test.name" . -}}
  {{- printf "%s-%s" $name "sa" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create image pull secrets for keycloak client
*/}}
{{- define "eric-oss-ml-platform-app-test.pullSecrets" -}}
  {{- $g := fromJson (include "eric-oss-ml-platform-app-test.global" .) -}}
  {{- if ((.Values).imageCredentials).pullSecret -}}
    {{- print .Values.imageCredentials.pullSecret -}}
  {{- else if $g.pullSecret -}}
    {{- print $g.pullSecret -}}
  {{- end -}}
{{- end -}}

{{/*
Enable Node Selector functionality
*/}}
{{- define "eric-oss-ml-platform-app-test.nodeSelector" -}}
{{- if .Values.nodeSelector }}
nodeSelector:
  {{ toYaml .Values.nodeSelector | trim }}
{{- else if .Values.global.nodeSelector }}
nodeSelector:
  {{ toYaml .Values.global.nodeSelector | trim }}
{{- end }}
{{- end -}}

{{/*
Generic image image Path (DR-D1121-067)
To use it, you should pass the imagekey, for instance
(include "eric-oss-ml-platform-app-test.imagePath" (set . "ImageKey" "mainImage"))
*/}}
{{- define "eric-oss-ml-platform-app-test.imagePath" }}
  {{- if not .ImageKey }}
    {{- fail "Chart failure: Missing ImageKey on template parameters" -}}
  {{- end }}
  {{- $productInfo := fromYaml (.Files.Get "eric-product-info.yaml") -}}
  {{- $name := (index $productInfo.images .ImageKey).name -}}
  {{- $tag := (index $productInfo.images .ImageKey).tag -}}
  {{- $repoPath := (index $productInfo.images .ImageKey).repoPath -}}
  {{- $registryUrl := (index $productInfo.images .ImageKey).registry -}}
  {{- if ((index .Values.imageCredentials .ImageKey).registry).url }}
    {{- $registryUrl = ((index .Values.imageCredentials .ImageKey).registry).url -}}
  {{- else if (((.Values).imageCredentials).registry).url }}
    {{- $registryUrl = .Values.imageCredentials.registry.url -}}
  {{- else if (((.Values).global).registry).url }}
    {{- if or (ne .Values.global.registry.url "armdocker.rnd.ericsson.se") (not (kindIs "invalid" ((.Values.global).registry).repoPath)) }}
      {{- $registryUrl = .Values.global.registry.url -}}
    {{- end }}
  {{- end }}
  {{- if not (kindIs "invalid" (index .Values.imageCredentials .ImageKey).repoPath) }}
    {{- $repoPath = (index .Values.imageCredentials .ImageKey).repoPath -}}
  {{- else if not (kindIs "invalid" (.Values.imageCredentials).repoPath)}}
    {{- $repoPath = .Values.imageCredentials.repoPath -}}
  {{- else if not ((kindIs "invalid" ((.Values.global).registry).repoPath) ) }}
    {{- $repoPath = .Values.global.registry.repoPath -}}
  {{- end }}
  {{- if $registryUrl }}
    {{- $registryUrl = printf "%s/" $registryUrl -}}
  {{- end -}}
  {{- if $repoPath -}}
    {{- $repoPath = printf "%s/" $repoPath -}}
  {{- end -}}
  {{- printf "%s%s%s:%s" $registryUrl $repoPath $name $tag -}}
{{- end -}}

{{/*
Create a map from ".Values.global" with defaults if missing in values file.
This hides defaults from values file.
*/}}
{{ define "eric-oss-ml-platform-app-test.global" }}
  {{- $globalDefaults := dict "security" (dict "tls" (dict "enabled" true)) -}}
  {{- $globalDefaults = merge $globalDefaults (dict "iam" (dict "clientId" "eo")) -}}
  {{- $globalDefaults = merge $globalDefaults (dict "iam" (dict "adminSecret" "eric-sec-access-mgmt-creds")) -}}
  {{- $globalDefaults = merge $globalDefaults (dict "iam" (dict "userKey" "kcadminid")) -}}
  {{- $globalDefaults = merge $globalDefaults (dict "iam" (dict "passwordKey" "kcpasswd")) -}}
  {{- $globalDefaults = merge $globalDefaults (dict "iam" (dict "cacert" (dict "secretName" "iam-cacert-secret"))) -}}
  {{- $globalDefaults = merge $globalDefaults (dict "iam" (dict "cacert" (dict "key" "tls.crt"))) -}}
  {{- $globalDefaults = merge $globalDefaults (dict "iam" (dict "cacert" (dict "filePath" "iam/ca.crt"))) -}}
  {{- $globalDefaults = merge $globalDefaults (dict "iam" (dict "internal" (dict "hostname" "eric-sec-access-mgmt-http"))) -}}
  {{- $globalDefaults = merge $globalDefaults (dict "iam" (dict "internal" (dict "adminClientName" "eric-cnbase-oss-config-iam-admin-client"))) -}}
  {{- $globalDefaults = merge $globalDefaults (dict "iam" (dict "internal" (dict "adminClientCertSecret" "eric-cnbase-oss-config-iam-admin-client-cert-secret"))) -}}
  {{- $globalDefaults = merge $globalDefaults (dict "security" (dict "tls" (dict "trustedInternalRootCa" (dict "secret" "eric-sec-sip-tls-trusted-root-cert")))) -}}
  {{- $globalDefaults = merge $globalDefaults (dict "internalIPFamily" "") -}}
  {{- $globalDefaults = merge $globalDefaults (dict "timezone" "UTC") -}}
  {{- $globalDefaults = merge $globalDefaults (dict "nodeSelector" (dict)) -}}
  {{- $globalDefaults = merge $globalDefaults (dict "securityPolicy" (dict "rolekind" "")) -}}
  {{ if (.Values).global }}
    {{- mergeOverwrite $globalDefaults .Values.global | toJson -}}
  {{ else }}
    {{- $globalDefaults | toJson -}}
  {{ end }}
{{ end }}