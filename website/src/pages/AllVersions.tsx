import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Anchor,
  Container,
  Heading,
  HStack,
  Stack,
  Text,
  VStack,
} from "@hope-ui/solid";
import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";
import { createCachedResource } from "solid-cached-resource";
import SolidMarkdown from "solid-markdown";
import { Platform } from "../hooks/usePlatform";
import gfm from "remark-gfm";

enum AssetTypes {
  sums = "sums",
  linux = "linux",
  mac = "mac",
  windows = "windows",
  android = "android",
}

const octokit = new Octokit();
const AllVersions = () => {
  const [data] = createCachedResource("gh-releases", () => {
    return octokit.repos.listReleases({
      owner: "KRTirtho",
      repo: "spotube",
    });
  });

  return (
    <VStack alignItems="stretch" m="$3">
      <Heading size="3xl">Previous Versions</Heading>
      <Text my="$5">
        If any of your version is not working correctly than you can download &
        use previous versions of Spotube too
      </Text>
      <VStack alignItems="stretch" spacing="$3" mr="$1">
        {data()?.data.map((release, i) => {
          const releaseSome = release.assets
            .map((asset) => {
              const platform =
                Object.keys(Platform).find((platform) =>
                  asset.name.toLowerCase().includes(platform)
                ) ?? "sums";
              return {
                type: AssetTypes[platform as keyof typeof AssetTypes],
                asset,
              };
            })
            .reduce((acc, val) => {
              acc[val.type] = [...(acc[val.type] ?? []), val.asset];
              return acc;
            }, {} as any) as {
            [key in AssetTypes]: RestEndpointMethodTypes["repos"]["listReleases"]["response"]["data"][0]["assets"];
          };
          return (
            <VStack
              py="$3"
              alignItems="flex-start"
              borderBottom="1px solid grey"
              _last={{ borderBottom: "none" }}
            >
              <Heading size="xl">
                Version{" "}
                <Text as="span" color="$success8">
                  {release.tag_name}
                </Text>{" "}
                {i == 0 && "(Latest)"}
              </Heading>
              {Object.entries(releaseSome).map(([type, assets]) => {
                return (
                  <HStack py="$2" alignItems="flex-start">
                    <Heading
                      w={90}
                      p="$2"
                      color="$info12"
                      border={`2px solid #404040`}
                      borderRadius="5px 0 0 5px"
                      borderRight="none"
                    >
                      {type[0].toUpperCase() + type.slice(1)}
                    </Heading>
                    <VStack
                      alignItems="flex-start"
                      border={`2px solid #404040`}
                      borderRadius={`0 5px 5px ${
                        assets.length !== 1 ? 5 : 0
                      }px`}
                      w="$72"
                    >
                      {assets.map((asset) => {
                        return (
                          <Anchor
                            color="$info11"
                            width="$full"
                            p="$2"
                            href={asset.name}
                          >
                            {asset.name}
                          </Anchor>
                        );
                      })}
                    </VStack>
                  </HStack>
                );
              })}
              <Accordion defaultIndex={i}>
                <AccordionItem>
                  <AccordionButton>
                    Release Notes <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <SolidMarkdown
                      components={{
                        a: (props) => (
                          <Anchor {...(props as any)} color="$info10" />
                        ),
                        h1: (props) => (
                          <Heading
                            {...(props as any)}
                            size="4xl"
                            mt="$5"
                            mb="$1_5"
                          />
                        ),
                        h2: (props) => (
                          <Heading
                            {...(props as any)}
                            size="3xl"
                            mt="$5"
                            mb="$1_5"
                          />
                        ),
                        h3: (props) => (
                          <Heading
                            {...(props as any)}
                            size="2xl"
                            mt="$5"
                            mb="$1_5"
                          />
                        ),
                        h4: (props) => (
                          <Heading {...(props as any)} size="md" />
                        ),
                        h5: (props) => (
                          <Heading {...(props as any)} size="lg" />
                        ),
                        h6: (props) => (
                          <Heading {...(props as any)} size="md" />
                        ),
                        p: (props) => <Text {...(props as any)} size="" />,
                      }}
                      remarkPlugins={[gfm]}
                    >
                      {release.body ?? ""}
                    </SolidMarkdown>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </VStack>
          );
        })}
      </VStack>
    </VStack>
  );
};

export default AllVersions;
