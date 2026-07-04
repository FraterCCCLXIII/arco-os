/**
 * Communications workspace layouts — direct messages, Slack-style groups,
 * the social feed, contacts, and the phone dialer. All read the comms slice.
 */
import {
  ContactsWorkspace,
  MessagesWorkspace,
  PhoneWorkspace,
  SlackWorkspace,
  SocialWorkspace,
} from "longformer-ui";
import { primaryUser } from "../demo-personas";
import type { WorkspaceLayoutBuilder } from "./types";

export const buildMessagesLayout: WorkspaceLayoutBuilder = (vm) => ({
  main: (
    <MessagesWorkspace
      contacts={vm.messageContacts}
      activeContactId={vm.activeContactId}
      onSelectContact={vm.setActiveContactId}
      messages={vm.directMessages[vm.activeContactId] ?? []}
      composerValue={vm.messageComposerValue}
      onComposerChange={vm.setMessageComposerValue}
      onSubmit={vm.handleSendMessage}
    />
  ),
});

export const buildSlackLayout: WorkspaceLayoutBuilder = (vm) => ({
  main: (
    <SlackWorkspace
      workspaces={vm.slackWorkspaces}
      activeWorkspaceId={vm.activeSlackWorkspaceId}
      onSelectWorkspace={vm.setActiveSlackWorkspaceId}
      navItems={vm.slackNavItems}
      channels={vm.slackChannels}
      directMessages={vm.slackDirectMessages}
      activeConversationId={vm.activeSlackConversationId}
      onSelectConversation={(id) => {
        vm.setActiveSlackConversationId(id);
        vm.setSlackProfileMemberId(null);
      }}
      conversationTitle={vm.activeSlackConversationTitle}
      conversationTopic={vm.activeSlackConversationTopic}
      messages={vm.slackMessages[vm.activeSlackConversationId] ?? []}
      composerValue={vm.slackComposerValue}
      onComposerChange={vm.setSlackComposerValue}
      onSubmit={vm.handleSlackSubmit}
      unreadMentionCount={4}
      profileMember={vm.activeSlackProfileMember}
      profileOpen={Boolean(vm.activeSlackProfileMember)}
      onProfileClose={() => vm.setSlackProfileMemberId(null)}
      onOpenProfile={vm.handleOpenSlackProfile}
      currentUser={{ name: primaryUser.name, status: "online" }}
    />
  ),
});

export const buildSocialLayout: WorkspaceLayoutBuilder = (vm) => ({
  main: (
    <SocialWorkspace
      networks={vm.socialNetworks}
      activeNetworkId={vm.activeSocialNetworkId}
      onSelectNetwork={vm.setActiveSocialNetworkId}
      twitterNavItems={vm.twitterNavItems}
      facebookShortcuts={vm.facebookShortcuts}
      facebookStories={vm.facebookStories}
      posts={vm.socialPosts}
      trends={vm.socialTrends}
      news={vm.socialNews}
      suggestions={vm.socialSuggestions}
      birthdays={vm.socialBirthdays}
      contactsOnline={vm.socialContactsOnline}
      composerValue={vm.socialComposerValue}
      onComposerChange={vm.setSocialComposerValue}
      onComposerSubmit={vm.handleSocialSubmit}
      feedTab={vm.socialFeedTab}
      onFeedTabChange={vm.setSocialFeedTab}
      currentUser={{ name: primaryUser.name, handle: primaryUser.handle }}
    />
  ),
});

export const buildContactsLayout: WorkspaceLayoutBuilder = (vm) => ({
  main: (
    <ContactsWorkspace
      contacts={vm.phoneContacts}
      activeContactId={vm.activePhoneContactId}
      onSelectContact={vm.setActivePhoneContactId}
      searchQuery={vm.contactSearch}
      onSearchChange={vm.setContactSearch}
      dialValue={vm.dialValue}
      onDialChange={vm.setDialValue}
      onCall={() => undefined}
      onMessageContact={() => vm.setWorkspaceId("messages")}
      onEmailContact={() => vm.setWorkspaceId("email")}
    />
  ),
});

export const buildPhoneLayout: WorkspaceLayoutBuilder = (vm) => ({
  main: (
    <PhoneWorkspace
      dialValue={vm.dialValue}
      onDialChange={vm.setDialValue}
      contacts={vm.phoneContacts}
      activeContact={vm.phoneContacts.find((contact) => contact.id === vm.activePhoneContactId)}
    />
  ),
});
