"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, ThumbsUp, ThumbsDown, Link, Send } from "lucide-react";
import { generateContent } from "@/lib/contentGenerator";
import { addToLibrary, ContentLibrary } from "@/lib/contentLibrary";
import Image from "next/image";
import { Article } from "@/lib/types";
import { marked } from "marked";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";

const EXAMPLE_ARTICLES: Article[] = [
  {
    title: "Mastercard shifts B2B marketing focus",
    url: "https://www.marketingweek.com/mastercard-b2b-marketing/",
    description:
      "Mastercard’s sales team used to inundate marketing with requests for “pretty pictures” but the brand’s B2B marketing lead has redefined its role by prioritising human relationships.",
    image:
      "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=2787&auto=format&fit=crop",
    content: `Mastercard has completely overhauled its B2B marketing function over the past seven years, releasing it from its former role as service provider to sales to a team deemed critical to growth.

On joining Mastercard as its vice-president of B2B marketing in 2017, Lisa Maxwell, said the B2B marketing function was still “in its infancy” and the wider business, in particular sales, thought the role of its B2B marketers was simply to provide “pretty pictures”.

Talking at the IAA B2B Brand Summit in London yesterday (17 October), she said the sales team would often say “I need to go to a customer tomorrow, please could you make the deck look nice?”.

Seven years on, the marketing function has developed hugely and she believes this has come from prioritising human relationships, both with B2B buyers and internal stakeholders.

She started by running an employee survey to get better insights into the issues. One of the sentiments that came out was that the sales team did not feel capable of talking about all the products and solutions in an effective way.

To combat this, the marketing function decided to “join hands” with the sales team and the Mastercard employee training function to tackle the problem together, rather than attempt to solve the issue alone.

She said this process of coming together involved building foundational materials for the sales team that everyone could use to gain a better understanding of the B2B solutions offered by the business.

Maxwell added that the sales excellence team could then measure the sentiment from the sales team before and after the training to get data on the developing confidence of the sales function. “Now, the sales teams feel extremely conversant on all the products and solutions,” she said, adding that the joined-up approach to training has become one of the systems that Mastercard employs “consistently” to create a synergy between teams.
## Looking outwards
From a consumer point of view, Mastercard is a well-known brand. Many people have a card featuring its distinct red and yellow logo in their wallet and the proposition is clear. But the B2B challenge is more nuanced, Maxwell said. 

On joining the brand, she was tasked with helping businesses better understand that Mastercard is “more than just a card company”, and that its offer also includes other financial solutions and services for businesses.

Once internal stakeholder relationships had improved, Maxwell then took the same approach of prioritisng human relationships to help develop the brand’s B2B business with customers.

“When you go to a client meeting with LinkedIn, for instance, you’re meeting a person who happens to work in an organisation, but you have to think, ‘how do I talk to you as a whole person, as someone who probably has a Mastercard in their pocket, but who is also interested in buying a service or solution from Mastercard’,” she said.

She added it’s crucial to begin by connecting on a human level and then extending this to the services and solutions Mastercard can provide.
One of the ways the business centres the human aspect is by carefully considering what consumers and partner businesses want.

During the Grammys, for example, Mastercard joined forces with ride-sharing company Lyft, one of its B2B partners, to launch a purpose-driven campaign to encourage more people to use Mastercard – every time someone at the event paid for Lyft with their Mastercard, a tree would be planted. The campaign also linked to social good, which helped engage consumers emotionally, she said.

Maxwell said the goal of the partnership was to understand and unite the aims of both consumers and partner businesses. She added: “This shows how centring the human in the story helps both the consumer side and the B2B side of the business.”`,
  },
  {
    title: "Why CEOs keep dunking on their own brands",
    url: "https://www.fastcompany.com/91206366/why-ceos-keep-dunking-on-their-brands-adidas-nike-red-lobster-starbucks",
    description:
      "From Adidas to Red Lobster, CEOs are increasingly criticizing their own companies' products—and it might actually be good for business.",
    image:
      "https://www.spellbrand.com/wp-content/uploads/2016/06/brand-identity-system-featured-1.jpg",
    content: `When Elliott Hill begins his stint as the new chief executive of Nike next week, he might consider stealing a move from longtime rival Adidas—and talk some trash about his own company.

Adidas was saddled with multiple problems (including the messy dissolution of its partnership with Yeezy and resulting inventory overload) when Puma veteran Bjørn Gulden took the reins in early 2023. Many had an unabashedly critical take on the company, most notably Bjørn Gulden himself. “The numbers speak for themselves,” he said in a company press release, not long after taking over the top job. “We are currently not performing the way we should.” Gulden granted that Adidas had “the ingredients to be successful” but suggested they were in disarray. “We need to put the pieces back together again,” he said, “but we need some time.”

He referred to the year ahead as a “reset” period—a year of transition to set the base to again be a growing and profitable company.”
It’s that last bit that gives away the real point of dunking on your own brand when in comeback mode: You want to be judged against the worst possible baseline, not the far more impressive performance from back before the problems set in. Partly, this practice—call it self-negging—is a classic under-promise and over-deliver strategy: Get expectations low enough and you look like a rock star for getting the basics right. 

And in a stretch that’s seen plenty of CEO churn, thanks to disappointing performances, new chief executives haven’t been shy about inheriting negatives. Starbucks has “drifted from [its] core,” its new CEO Brian Niccol wrote in an open letter last month. The experience “can feel transactional, menus can feel overwhelming, product is inconsistent, the wait too long or the handoff too hectic.” He announced a “first hundred days” plan to visit U.S. locations and take steps toward a back-to-the-core effort.

Red Lobster, recently emerging from bankruptcy, has closed more than a hundred locations and cycled through multiple CEOs. “There’s a hole to climb out of, for sure,” its new chief executive Damola Adamolekun told CNN earlier this month. The 35-year-old former P.F. Chang CEO has so far announced only incremental changes” but, not surprisingly, has stressed that the chain’s now infamous endless-shrimp special (since discontinued) made little financial sense and caused “a lot of chaos.”

The strategy doesn’t always work, and can easily come across as simply scapegoating past management or fallout from C-suite knife-fighting (see Bob Iger’s return to the top job at a beleaguered Disney in 2022, for example). But if share price is any indicator, Adidas executed well on buying time to prove it could execute better in running its actual business.

In May, just a few months into Gulden’s tenure, Adidas’s progress was mixed (it still held much more inventory than analysts expected), but setting a low bar was already helping the company’s stock price, which has now risen about 28% since the beginning of the year. For his part, Gulden didn’t exactly raise the bar much at his first earnings call with investors in April, instead saying that arch-rival Nike had done a better job with its product mix.

Whatever Gulden’s motivation was, that sounds generous in retrospect: Nike is the one facing big challenges under a new leader. A pandemic-era move toward more direct sales at the expense of retail partnerships has proved rocky. And rival up-and-comers including Hoka and On have built devoted athlete audiences and resonant brands—aka, traditional Nike strengths. It’s no secret that the company has suffered through “a moribund patch,” as Fast Company reported back in May, marked by flattening sales and layoffs. After news broke in September that Hill would replace CEO John Donahue, the price of Nike shares immediately jumped about 8%, before eventually sliding back down.

Nike has postponed its planned November investor day event, so it’s not clear when we’ll hear from Hill in a substantial way. But, while he appears to be a popular choice, he may be wise to make his opening notes downbeat: underscoring the depth of the challenges rather than promising quick solutions. It may also be wise to do so sooner than the company’s next earnings report in the new year: Setting expectations isn’t just about predicting where you’ll finish, but defining the starting line.

As it turned out, Adidas really did have a pretty lousy 2023, posting its first annual loss in more than three decades. While it seems to have worked through the Yeezy issue, the company still expects North American revenue to decline in 2024. Still, Guldin could say with a straight face that the year “ended better than what I had expected.” Well, of course, it did: After all, he indicated that he expected the worst.

But Guldin wasn’t exactly bragging, calling the results “by far not good enough.” Even so, the Adidas share price is up 90% since he started. Chalk that up to the power of (self-directed) trash talk.`,
  },
  {
    title:
      "YouTube viewing habits are changing. Where does this leave creators, brands and agencies?",
    url: "https://www.thedrum.com/news/2024/10/18/youtube-viewing-habits-are-changing-where-does-leave-creators-brands-and-agencies",
    description:
      "As the video platform launches an initiative to show the UK government the economic value of creator content, we catch up with its vice-president for EMEA, Pedro Pina, to find out more.",
    image:
      "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=2874&auto=format&fit=crop",
    content: `"The device with the highest growth on YouTube is the living room, the big screen," says YouTube vice-president for EMEA, Pedro Pina, who tells The Drum that co-watching is back and even Gen Z is getting involved.

Between 2021 and 2023, the number of YouTube's most watched creators who received the majority of their watch time on TV screens increased by more than 400%, according to the company's latest Why We Watch survey.

YouTube is at a waypoint, investing in new formats such as YouTube shorts, reflecting on evolving viewing habits and also trying to champion the economic value of its creators.

This week, to much fanfare, in a room full of high-energy YouTube creators – some of whom were performing – YouTube announced its Creator Consultation in a bid to show decision-makers the value of the "creator ecosystem," which it estimates contributes £2bn to the UK's annual GDP and supports more than 45,000 jobs in the UK.

With UK prime minister Keir Starmer this week stating a desire to "rip out the bureaucracy that blocks investment," this could be fortuitous timing for YouTube.

It is YouTube's intention to appeal to the government. To this end, Pina wants to deliver "a piece of research that is properly supported by feedback from a broad base of creators" so that it can "hopefully feed into the government's commitment to invest in the creative industries," he says.

The research will be delivered next year and Pina is hopeful that it will be acknowledged. "It's exciting to see a government that defines – as part of its industrial strategy – the creative industries as belonging to it. That's really great news. You don't see that a lot and then that's something we applaud and are enthusiastic about."

Anecdotal evidence already gathered by YouTube hints at creators wanting to see formal education pathways into the industry, access to studio space outside London and film permits being easier to acquire.

Other gatekeepers will also be appealed to when the report is ready, as creators feel shut out from the traditional creative and media landscape, according to YouTube.

"They have barriers they're facing and, like any entrepreneurs, they want those barriers removed," says Pina.

While the mass consultation is UK-focused, further creator consultations will be rolled out globally, according to Pina, who suspects the pain points of UK creators will be "replicated across other countries."

He's keen to highlight the power of the British creative brand as an export. "We've always exported our creative product in this country and continue to launch products and features that help creators do that. We want to use AI to help creators transform their videos into as many languages as possible." Pedro also notes that 85% of YouTube creators watch time takes place from outside the UK.

Despite investing in YouTube shorts "to give users what they want," long-form is in good health, he points out.

"We really see users jumping from format to format, from long to short. They find out about creators they never heard about through shorts and then they go and explore all their long format."`,
  },
  {
    title:
      "Adept AI Makes Major Pivot After Amazon Hires Away 66% of the Company",
    url: "https://bizzline.ai/post/adept-ai-makes-major-pivot-after-amazon-hires-away-66-of-the-company",
    description: `Adept AI recently saw Amazon hire away two-thirds of its core team, including its co-founder and CEO. In response, the company has announced it will pivot entirely "towards solutions that enable agentic AI, powered by existing in-house models, data, and custom infrastructure," according a recent update. What does this mean for the wider AI market? Let's find out.`,
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2832&auto=format&fit=crop",
    content: `## The Fundamentals

**Founded:** 2021
**Founders:** Ashish Vaswani, David Luan, Kelsey Szot, Niki Parmar
**Funding:** $415 million (latest: $350 billion Series B) @ $1+ billion
**HQ:** San Francisco
**Website:** www.adept.ai

## The Background 
Adept AI was shot into existence in part by the AI rush of 2021 and in part by the pedigree of its founders. CEO David Luan was VP of engineering at OpenAI. Another two co-founders, Ashish Vaswani and Niki Parmar, are co-authors on the paper that introduced the concept of transformers to the world. 

Within a year of launch, Adept AI raised $65 million in a round led by Greylock and Addition. Just a year after that, in March 2023, the company raised a whopping $350 million in a Series B round General Catalyst and Spark Capital.

The concept behind Adept is simple but startlingly revolutionary: building the technology to put AI at the center of all human-computer interaction. The idea is that a single command gets translated by the AI into a complex set of actions. This is the Great Dream of AI—you tell a computer to do something hard and...it just does it. 


## The Trend Line 
Amazon's hiring of two-thirds of the company is about as cataclysmic of an even a startup can go through, without fully dying. However, Adept CEO Zach Brock, the company's former head of engineering, appears to be thinking on his feet, namely by making some some difficult strategic choices.

Adept has a lot going for it. The company still has a lot of experience in building AI and enough of a war chest to continue innovating. Its pivot means that it will not be competing for "holy grail" research-intensive solutions, general intelligence being the prime example, but will switch to pursuing actionable business strategies, most likely at the enterprise level.

According to a company announcement, "By concentrating on agentic AI solutions, Adept aims to maintain its momentum and drive innovation in the field. The new leadership team is enthusiastic about solving real work problems for a wide range of customers, from small businesses to large corporations."

The move comes only months after Inflection AI was acquired by Microsoft less than two years after its founding. Reid Hoffman, the founder of LinkedIn, a co-founder of Inflection and a member of the Microsoft board, predicted recently that there would be more Inflection-style acquisitions by big tech companies of major AI startups, like Inflection and Adept.
 
## The Bottom Line 
Overall, while this might appear to be a consolidation of AI by big tech—and very much is—it's a consolidation happening at the base layer of the AI stack. With companies like Adept AI flipping to business oriented approaches, the industry could see a much stronger move to AI applications driven by small and medium-sized companies, while OpenAI, Microsoft, Google and Amazon drive the development of new research and foundational models, an extremely risk-laden and expensive endeavor.

This is both a consolidation of the AI ecosystem but also a maturation. Companies that were able to glide on robust updrafts from the AI gold rush are now buckling down and focusing on using their remarkable tech and talent to solve business problems. That's good for these companies but, just as importantly, it's also good for the health of the industry.`,
  },
  {
    title: "Custom URL",
    url: "",
    description: "Enter your own article URL",
    content: "",
  },
];

interface ContentSwiperProps {
  onSaveContent: (library: ContentLibrary) => void;
  contentLibrary: ContentLibrary;
}

export default function ContentSwiper({
  onSaveContent,
  contentLibrary,
}: ContentSwiperProps) {
  const [articleUrl, setArticleUrl] = useState("");
  const [platform, setPlatform] = useState("linkedin");
  const [content, setContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState("custom");
  const [selectedArticleData, setSelectedArticleData] =
    useState<Article | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string>("");
  const [imagePrompt, setImagePrompt] = useState<string>("");
  const [isArticleFetched, setIsArticleFetched] = useState(false);
  const [generatedTitle, setGeneratedTitle] = useState<string>("");
  const [showGeneratedContent, setShowGeneratedContent] = useState(false);
  const [imageAuthorUrl, setImageAuthorUrl] = useState<string>("");
  const [imageAuthor, setImageAuthor] = useState<string>("");

  const handleArticleSelect = (value: string) => {
    setSelectedArticle(value);
    setShowGeneratedContent(false);
    if (value !== "custom") {
      const article = EXAMPLE_ARTICLES.find((a) => a.url === value);
      if (article) {
        setArticleUrl(article.url);
        setSelectedArticleData(article);
        setIsArticleFetched(true);
      }
    } else {
      setArticleUrl("");
      setSelectedArticleData(null);
      setIsArticleFetched(false);
    }
  };

  const handleGenerate = async () => {
    if (!isValidUrl(articleUrl)) {
      toast("Incorrect URL format", {
        style: { background: "red", color: "white" },
      });
      return;
    }

    setIsGenerating(true);
    try {
      const articleContent = selectedArticleData?.content || "";
      const {
        text,
        title,
        imagePrompt,
        imageUrl,
        imageAuthor,
        imageAuthorUrl,
      } = await generateContent(articleUrl, platform, articleContent);
      setContent(text);
      setGeneratedTitle(title);
      setImagePrompt(imagePrompt);
      setGeneratedImage(imageUrl);
      setImageAuthor(imageAuthor);
      setImageAuthorUrl(imageAuthorUrl);
      setShowGeneratedContent(true);
    } catch (error) {
      toast("Failed to generate content. Please try again.", {
        style: { background: "red", color: "white" },
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSwipe = async (liked: boolean) => {
    if (liked) {
      const urlName = new URL(articleUrl).hostname;
      const updatedLibrary = addToLibrary(
        contentLibrary,
        urlName,
        content,
        platform as "linkedin" | "twitter",
        generatedImage,
        generatedTitle,
        imageAuthor,
        imageAuthorUrl
      );
      onSaveContent(updatedLibrary);
      toast("The content has been added to your library.", {
        style: { background: "green", color: "white" },
      });
    }
    await handleGenerate();
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleCustomUrlSelect = async (url: string) => {
    setIsGenerating(true);
    setIsArticleFetched(false);
    setShowGeneratedContent(false);
    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to scrape article");
      }

      const article: Article = await response.json();
      setSelectedArticleData(article);
      setArticleUrl(article.url);
      setIsArticleFetched(true);
    } catch (error) {
      toast("Failed to fetch article content. Please try again.", {
        style: { background: "red", color: "white" },
      });
      setIsArticleFetched(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlatformChange = (value: string) => {
    setPlatform(value);
    setShowGeneratedContent(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Generate Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedArticle} onValueChange={handleArticleSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an article or enter URL" />
            </SelectTrigger>
            <SelectContent>
              {EXAMPLE_ARTICLES.map((article) => (
                <SelectItem
                  key={article.url || "custom"}
                  value={article.url || "custom"}
                >
                  {article.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedArticle === "custom" && (
            <div className="flex items-center space-x-2">
              <Link className="h-5 w-5 text-gray-500" />
              <Input
                type="url"
                placeholder="Enter article URL"
                value={articleUrl}
                onChange={(e) => setArticleUrl(e.target.value)}
                className="flex-grow"
              />
              <Button
                onClick={() => handleCustomUrlSelect(articleUrl)}
                disabled={isGenerating || !articleUrl}
                size="sm"
                className="ml-2"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Fetch Article"
                )}
              </Button>
            </div>
          )}

          <Select value={platform} onValueChange={handlePlatformChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="twitter">X (formerly Twitter)</SelectItem>
            </SelectContent>
          </Select>

          {!isGenerating && isArticleFetched && (
            <Button
              onClick={handleGenerate}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Send className="mr-2 h-5 w-5" />
              Generate Content
            </Button>
          )}

          {isGenerating && (
            <Button disabled className="w-full">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {selectedArticle === "custom" && !isArticleFetched
                ? "Fetching Article"
                : "Generating"}
            </Button>
          )}
        </CardContent>
      </Card>

      {showGeneratedContent && content && (
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">
              Generated Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              {generatedImage && (
                <div className="space-y-1">
                  <div className="relative w-[200px] h-[200px] rounded-lg overflow-hidden">
                    <HoverCard>
                      <HoverCardTrigger>
                        <Image
                          src={generatedImage}
                          alt="Generated content image"
                          fill
                          className="object-cover"
                        />
                      </HoverCardTrigger>
                      <HoverCardContent>
                        <p className="text-sm text-gray-600">
                          Image Prompt: {imagePrompt}
                        </p>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                  <div className="text-xs text-gray-500 text-center max-w-[200px] space-y-0.5">
                    <div>
                      Photo by{" "}
                      <a
                        href={imageAuthorUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-gray-700 break-words"
                      >
                        {imageAuthor}
                      </a>
                    </div>
                    <div>
                      on{" "}
                      <a
                        href="https://unsplash.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-gray-700"
                      >
                        Unsplash
                      </a>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-2">
                  {generatedTitle}
                </h3>
                <p className="text-gray-700 leading-relaxed">{content}</p>
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <Button
                onClick={() => handleSwipe(false)}
                variant="outline"
                className="w-[48%]"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ThumbsDown className="mr-2 h-5 w-5" />
                )}
                Dislike
              </Button>
              <Button
                onClick={() => handleSwipe(true)}
                className="w-[48%] bg-green-600 hover:bg-green-700"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ThumbsUp className="mr-2 h-5 w-5" />
                )}
                Like
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedArticleData && selectedArticleData.content && (
        <Card className="bg-white shadow-lg mt-6">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Article Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedArticleData.image && (
              <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
                <Image
                  src={selectedArticleData.image}
                  alt={selectedArticleData.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {selectedArticleData.title}
              </h2>
              <p className="text-gray-600 mb-4">
                {selectedArticleData.description}
              </p>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: marked(selectedArticleData.content),
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
