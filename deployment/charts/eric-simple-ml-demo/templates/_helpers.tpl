{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "eric-simple-ml-demo.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "eric-simple-ml-demo.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create chart version as used by the chart label.
*/}}
{{- define "eric-simple-ml-demo.version" -}}
{{- printf "%s" .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create common labels of the app.
*/}}
{{- define "eric-simple-ml-demo.labels" }}
app.kubernetes.io/name: {{ include "eric-simple-ml-demo.name" . }}
app.kubernetes.io/version: {{ include "eric-simple-ml-demo.version" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
helm.sh/chart: {{ include "eric-simple-ml-demo.chart" . }}
{{- end -}}

{{/*
Create annotation for the product information (DR-D1121-064, DR-D1121-067)
*/}}
{{- define "eric-simple-ml-demo.product-info" }}
ericsson.com/product-name: {{ (fromYaml (.Files.Get "eric-product-info.yaml")).productName | quote }}
ericsson.com/product-number: "CXPxxxxx/x"
ericsson.com/product-revision: {{ .Values.productInfo.rstate | quote }}
{{- end -}}

{{/*
Define service scheme.
*/}}
{{- define "eric-simple-ml-demo.serviceScheme" -}}
{{- printf "http" -}}
{{- end -}}

{{/*
Define service port.
*/}}
{{- define "eric-simple-ml-demo.servicePort" -}}
{{- printf "8050" -}}
{{- end -}}

{{/*
Create image pull secrets
*/}}
{{- define "eric-simple-ml-demo.pullSecrets" -}}
  {{- $pullSecret := "" -}}
  {{- if .Values.global -}}
    {{- if .Values.global.pullSecret -}}
      {{- $pullSecret = .Values.global.pullSecret -}}
    {{- end -}}
  {{- end -}}
  {{- if .Values.imageCredentials -}}
    {{- if .Values.imageCredentials.pullSecret -}}
      {{- $pullSecret = .Values.imageCredentials.pullSecret -}}
    {{- end -}}
  {{- end -}}
  {{- print $pullSecret -}}
{{- end -}}

{{/*
Timezone variable
*/}}
{{- define "eric-simple-ml-demo.timezone" -}}
{{- $timezone := "UTC" -}}
{{- if .Values.global  -}}
  {{- if .Values.global.timezone -}}
    {{- $timezone = .Values.global.timezone -}}
  {{- end -}}
{{- end -}}
{{- print $timezone | quote -}}
{{- end -}}

{{/*
Create any image path from eric-product-info.yaml (DR-D1121-067)
*/}}
{{- define "eric-simple-ml-demo.imagePath" }}
  {{- $values := index . "values" -}}
  {{- $imageId := index . "imageId" -}}
  {{- if and $values.image (eq $imageId "simple-ml-demo") -}}
    {{- $values.image -}}
  {{- else -}}
    {{- $files := index . "files" -}}
    {{- $productInfo := fromYaml ($files.Get "eric-product-info.yaml") -}}
    {{- $registryUrl := index $productInfo "images" $imageId "registry" -}}
    {{- $repoPath := index $productInfo "images" $imageId "repoPath" -}}
    {{- $name := index $productInfo "images" $imageId "name" -}}
    {{- $tag :=  index $productInfo "images" $imageId "tag" -}}
    {{- if $values.global -}}
      {{- if $values.global.registry -}}
        {{- $registryUrl = default $registryUrl $values.global.registry.url -}}
      {{- end -}}
    {{- end -}}
    {{- if $values.imageCredentials -}}
      {{- if $values.imageCredentials.registry -}}
        {{- $registryUrl = default $registryUrl $values.imageCredentials.registry.url -}}
      {{- end -}}
      {{- if not (kindIs "invalid" $values.imageCredentials.repoPath) -}}
        {{- $repoPath = $values.imageCredentials.repoPath -}}
      {{- end -}}
      {{- $image := index $values.imageCredentials $imageId -}}
      {{- if $image -}}
        {{- if $image.registry -}}
          {{- $registryUrl = default $registryUrl $image.registry.url -}}
        {{- end -}}
        {{- if not (kindIs "invalid" $image.repoPath) -}}
          {{- $repoPath = $image.repoPath -}}
        {{- end -}}
      {{- end -}}
    {{- end -}}
    {{- if $repoPath -}}
      {{- $repoPath = printf "%s/" $repoPath -}}
    {{- end -}}
    {{- printf "%s/%s%s:%s" $registryUrl $repoPath $name $tag -}}
  {{- end -}}
{{- end -}}

{{/*
Secret for mxe user credentials
*/}}
{{- define "eric-simple-ml-demo.mxeSecret" -}}
{{- printf "%s-%s" (include "eric-simple-ml-demo.name" .) (default "mxe-user" .Values.mxe.credentials.name) | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Enable Node Selector functionality
*/}}
{{- define "eric-simple-ml-demo.nodeSelector" -}}
{{- if .Values.nodeSelector }}
nodeSelector:
  {{ toYaml .Values.nodeSelector | trim }}
{{- else if .Values.global.nodeSelector }}
nodeSelector:
  {{ toYaml .Values.global.nodeSelector | trim }}
{{- end }}
{{- end -}}
