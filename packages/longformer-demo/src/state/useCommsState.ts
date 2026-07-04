/**
 * Communications workspaces state — direct messages, Slack-style groups,
 * social feed, and phone contacts. These four share a "pick a conversation,
 * compose, send" shape, so they live together; each still exposes its own
 * keys so a future split into separate stores is mechanical.
 */
import { useCallback, useMemo, useState } from "react";
import type { DirectMessage, SlackMessage, SocialNetworkId, SocialPost } from "longformer-ui";
import { primaryUser } from "../demo-personas";
import { messageContacts, messageThreads } from "../mock-data/messages";
import { phoneContacts } from "../mock-data/contacts";
import {
  slackChannelMessages,
  slackChannelTopics,
  slackChannels,
  slackDirectMessageThreads,
  slackDirectMessages,
  slackMembers,
  slackNavItems,
  slackSenderToMemberId,
  slackWorkspaces,
} from "../mock-data/slack";
import {
  facebookShortcuts,
  facebookStories,
  socialBirthdays,
  socialContactsOnline,
  socialNetworks,
  socialNews,
  socialPosts as initialSocialPosts,
  socialSuggestions,
  socialTrends,
  twitterNavItems,
} from "../mock-data/social";

export function useCommsState() {
  // --- Direct messages -------------------------------------------------
  const [activeContactId, setActiveContactId] = useState<string>(messageContacts[0].id);
  const [messageComposerValue, setMessageComposerValue] = useState("");
  const [directMessages, setDirectMessages] = useState<Record<string, DirectMessage[]>>(messageThreads);

  const handleSendMessage = useCallback(() => {
    if (!messageComposerValue.trim()) return;
    const newMessage: DirectMessage = {
      id: `dm-${Date.now()}`,
      senderId: "me",
      content: messageComposerValue,
      timestamp: "Just now",
    };
    setDirectMessages((prev) => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] ?? []), newMessage],
    }));
    setMessageComposerValue("");
  }, [messageComposerValue, activeContactId]);

  // --- Slack-style groups ----------------------------------------------
  const [activeSlackWorkspaceId, setActiveSlackWorkspaceId] = useState<string>(slackWorkspaces[0].id);
  const [activeSlackConversationId, setActiveSlackConversationId] = useState<string>("ch-events");
  // Channels and DM threads share one message map keyed by conversation id.
  const [slackMessages, setSlackMessages] = useState<Record<string, SlackMessage[]>>(() => ({
    ...slackChannelMessages,
    ...slackDirectMessageThreads,
  }));
  const [slackComposerValue, setSlackComposerValue] = useState("");
  const [slackProfileMemberId, setSlackProfileMemberId] = useState<string | null>(null);

  const handleSlackSubmit = useCallback(() => {
    if (!slackComposerValue.trim() || !activeSlackConversationId) return;
    const newMessage: SlackMessage = {
      id: `slack-${Date.now()}`,
      senderId: "me",
      senderName: primaryUser.name,
      content: slackComposerValue,
      timestamp: "Just now",
    };
    setSlackMessages((prev) => ({
      ...prev,
      [activeSlackConversationId]: [...(prev[activeSlackConversationId] ?? []), newMessage],
    }));
    setSlackComposerValue("");
  }, [slackComposerValue, activeSlackConversationId]);

  const handleOpenSlackProfile = useCallback((senderId: string) => {
    const memberId = slackSenderToMemberId[senderId];
    if (memberId) setSlackProfileMemberId(memberId);
  }, []);

  const activeSlackChannel = slackChannels.find((channel) => channel.id === activeSlackConversationId);
  const activeSlackDm = slackDirectMessages.find((dm) => dm.id === activeSlackConversationId);
  const activeSlackConversationTitle = activeSlackChannel
    ? activeSlackChannel.name
    : activeSlackDm?.name ?? "Conversation";
  const activeSlackConversationTopic = activeSlackChannel
    ? slackChannelTopics[activeSlackChannel.id]
    : undefined;
  const activeSlackProfileMember = slackProfileMemberId
    ? slackMembers[slackProfileMemberId] ?? null
    : null;

  // --- Social feed -------------------------------------------------------
  const [activeSocialNetworkId, setActiveSocialNetworkId] = useState<SocialNetworkId>("twitter");
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(initialSocialPosts);
  const [socialComposerValue, setSocialComposerValue] = useState("");
  const [socialFeedTab, setSocialFeedTab] = useState("for-you");

  const handleSocialSubmit = useCallback(() => {
    if (!socialComposerValue.trim()) return;
    const newPost: SocialPost = {
      id: `social-${Date.now()}`,
      authorId: "me",
      authorName: primaryUser.name,
      authorHandle: primaryUser.handle,
      timestamp: "Just now",
      content: socialComposerValue.trim(),
      stats: { replies: 0, reposts: 0, likes: 0, views: 0 },
    };
    setSocialPosts((prev) => [newPost, ...prev]);
    setSocialComposerValue("");
  }, [socialComposerValue]);

  // --- Phone contacts -----------------------------------------------------
  const [activePhoneContactId, setActivePhoneContactId] = useState<string>(phoneContacts[0].id);
  const [contactSearch, setContactSearch] = useState("");
  const [dialValue, setDialValue] = useState(phoneContacts[0].phone);

  return useMemo(
    () => ({
      // Direct messages
      messageContacts,
      activeContactId,
      setActiveContactId,
      directMessages,
      messageComposerValue,
      setMessageComposerValue,
      handleSendMessage,
      // Slack
      slackWorkspaces,
      activeSlackWorkspaceId,
      setActiveSlackWorkspaceId,
      slackNavItems,
      slackChannels,
      slackDirectMessages,
      activeSlackConversationId,
      setActiveSlackConversationId,
      activeSlackConversationTitle,
      activeSlackConversationTopic,
      slackMessages,
      slackComposerValue,
      setSlackComposerValue,
      handleSlackSubmit,
      activeSlackProfileMember,
      setSlackProfileMemberId,
      handleOpenSlackProfile,
      // Social
      socialNetworks,
      activeSocialNetworkId,
      setActiveSocialNetworkId,
      twitterNavItems,
      facebookShortcuts,
      facebookStories,
      socialPosts,
      socialTrends,
      socialNews,
      socialSuggestions,
      socialBirthdays,
      socialContactsOnline,
      socialComposerValue,
      setSocialComposerValue,
      handleSocialSubmit,
      socialFeedTab,
      setSocialFeedTab,
      // Phone contacts
      phoneContacts,
      activePhoneContactId,
      setActivePhoneContactId,
      contactSearch,
      setContactSearch,
      dialValue,
      setDialValue,
    }),
    [
      activeContactId,
      directMessages,
      messageComposerValue,
      handleSendMessage,
      activeSlackWorkspaceId,
      activeSlackConversationId,
      activeSlackConversationTitle,
      activeSlackConversationTopic,
      slackMessages,
      slackComposerValue,
      handleSlackSubmit,
      activeSlackProfileMember,
      handleOpenSlackProfile,
      activeSocialNetworkId,
      socialPosts,
      socialComposerValue,
      handleSocialSubmit,
      socialFeedTab,
      activePhoneContactId,
      contactSearch,
      dialValue,
    ],
  );
}

export type CommsSlice = ReturnType<typeof useCommsState>;
