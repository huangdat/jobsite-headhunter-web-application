/**
 * Tests for FormData Builder utility
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, beforeEach } from "vitest";
import {
  appendFormField,
  appendString,
  appendNumber,
  appendBoolean,
  appendFile,
  appendFiles,
  appendArrayItems,
  appendIndexedFiles,
  buildFormData,
  mergeFormData,
} from "../formDataBuilder";

describe("formDataBuilder", () => {
  let formData: FormData;

  beforeEach(() => {
    formData = new FormData();
  });

  describe("appendFormField", () => {
    it("should append string value", () => {
      appendFormField(formData, "name", "John");

      expect(formData.get("name")).toBe("John");
    });

    it("should append number as string", () => {
      appendFormField(formData, "age", 30);

      expect(formData.get("age")).toBe("30");
    });

    it("should append boolean as string", () => {
      appendFormField(formData, "active", true);
      expect(formData.get("active")).toBe("true");

      appendFormField(formData, "inactive", false);
      expect(formData.get("inactive")).toBe("false");
    });

    it("should append File object", () => {
      const file = new File(["content"], "test.txt", { type: "text/plain" });
      appendFormField(formData, "document", file);

      expect(formData.get("document")).toBe(file);
    });

    it("should skip null value", () => {
      appendFormField(formData, "nullable", null);

      expect(formData.has("nullable")).toBe(false);
    });

    it("should skip undefined value", () => {
      appendFormField(formData, "optional", undefined);

      expect(formData.has("optional")).toBe(false);
    });
  });

  describe("appendString", () => {
    it("should append non-empty string", () => {
      appendString(formData, "email", "test@example.com");

      expect(formData.get("email")).toBe("test@example.com");
    });

    it("should not append empty string", () => {
      appendString(formData, "empty", "");

      expect(formData.has("empty")).toBe(false);
    });

    it("should not append undefined", () => {
      appendString(formData, "optional", undefined);

      expect(formData.has("optional")).toBe(false);
    });
  });

  describe("appendNumber", () => {
    it("should append positive number", () => {
      appendNumber(formData, "count", 42);

      expect(formData.get("count")).toBe("42");
    });

    it("should append zero", () => {
      appendNumber(formData, "zero", 0);

      expect(formData.get("zero")).toBe("0");
    });

    it("should append negative number", () => {
      appendNumber(formData, "negative", -10);

      expect(formData.get("negative")).toBe("-10");
    });

    it("should not append undefined", () => {
      appendNumber(formData, "optional", undefined);

      expect(formData.has("optional")).toBe(false);
    });

    it("should not append null", () => {
      appendNumber(formData, "nullable", null as any);

      expect(formData.has("nullable")).toBe(false);
    });
  });

  describe("appendBoolean", () => {
    it("should append true as string", () => {
      appendBoolean(formData, "isActive", true);

      expect(formData.get("isActive")).toBe("true");
    });

    it("should append false as string", () => {
      appendBoolean(formData, "isInactive", false);

      expect(formData.get("isInactive")).toBe("false");
    });

    it("should not append undefined", () => {
      appendBoolean(formData, "optional", undefined);

      expect(formData.has("optional")).toBe(false);
    });
  });

  describe("appendFile", () => {
    it("should append file", () => {
      const file = new File(["content"], "document.pdf", {
        type: "application/pdf",
      });
      appendFile(formData, "attachment", file);

      expect(formData.get("attachment")).toBe(file);
    });

    it("should not append undefined file", () => {
      appendFile(formData, "optional", undefined);

      expect(formData.has("optional")).toBe(false);
    });

    it("should handle files with special characters in name", () => {
      const file = new File(["content"], "my document (1).pdf", {
        type: "application/pdf",
      });
      appendFile(formData, "file", file);

      const appendedFile = formData.get("file") as File;
      expect(appendedFile.name).toBe("my document (1).pdf");
    });
  });

  describe("appendFiles", () => {
    it("should append multiple files", () => {
      const files = [
        new File(["content1"], "file1.txt", { type: "text/plain" }),
        new File(["content2"], "file2.txt", { type: "text/plain" }),
      ];

      appendFiles(formData, "documents", files);

      const entries = formData.getAll("documents") as File[];
      expect(entries).toHaveLength(2);
      expect(entries[0].name).toBe("file1.txt");
      expect(entries[1].name).toBe("file2.txt");
    });

    it("should handle FileList", () => {
      // Create a mock FileList-like object
      const fileArray = [
        new File(["test"], "test.txt", { type: "text/plain" }),
      ];
      appendFiles(formData, "files", fileArray as any);

      expect(formData.getAll("files")).toHaveLength(1);
    });

    it("should not append empty array", () => {
      appendFiles(formData, "empty", []);

      expect(formData.has("empty")).toBe(false);
    });

    it("should not append undefined", () => {
      appendFiles(formData, "optional", undefined);

      expect(formData.has("optional")).toBe(false);
    });
  });

  describe("appendArrayItems", () => {
    it("should append array with bracket notation", () => {
      appendArrayItems(formData, "tags", ["javascript", "react", "typescript"]);

      const items = formData.getAll("tags[]");
      expect(items).toHaveLength(3);
      expect(items).toEqual(["javascript", "react", "typescript"]);
    });

    it("should handle numeric array items", () => {
      appendArrayItems(formData, "ids", [1, 2, 3]);

      const items = formData.getAll("ids[]");
      expect(items).toEqual(["1", "2", "3"]);
    });

    it("should not append empty array", () => {
      appendArrayItems(formData, "empty", []);

      expect(formData.has("empty[]")).toBe(false);
    });

    it("should not append undefined", () => {
      appendArrayItems(formData, "optional", undefined);

      expect(formData.has("optional[]")).toBe(false);
    });
  });

  describe("appendIndexedFiles", () => {
    it("should append files with numeric index", () => {
      const files = [
        new File(["content1"], "file1.pdf"),
        new File(["content2"], "file2.pdf"),
      ];

      appendIndexedFiles(formData, "attachments", files);

      expect(formData.get("attachments[0]")).toBe(files[0]);
      expect(formData.get("attachments[1]")).toBe(files[1]);
    });

    it("should not append empty array", () => {
      appendIndexedFiles(formData, "docs", []);

      expect(formData.has("docs[0]")).toBe(false);
    });

    it("should not append undefined", () => {
      appendIndexedFiles(formData, "optional", undefined);

      expect(formData.has("optional[0]")).toBe(false);
    });
  });

  describe("buildFormData", () => {
    it("should build FormData from object", () => {
      const data = {
        name: "John",
        email: "john@example.com",
        age: 30,
        active: true,
      };

      const result = buildFormData(data);

      expect(result.get("name")).toBe("John");
      expect(result.get("email")).toBe("john@example.com");
      expect(result.get("age")).toBe("30");
      expect(result.get("active")).toBe("true");
    });

    it("should skip null and undefined values", () => {
      const data = {
        name: "John",
        middle: null as any,
        nickname: undefined as any,
        email: "john@example.com",
      };

      const result = buildFormData(data);

      expect(result.has("name")).toBe(true);
      expect(result.has("middle")).toBe(false);
      expect(result.has("nickname")).toBe(false);
      expect(result.has("email")).toBe(true);
    });

    it("should handle mixed data types", () => {
      const file = new File(["content"], "avatar.jpg");
      const data = {
        username: "testuser",
        count: 5,
        verified: true,
        avatar: file,
      };

      const result = buildFormData(data);

      expect(result.get("username")).toBe("testuser");
      expect(result.get("count")).toBe("5");
      expect(result.get("verified")).toBe("true");
      expect(result.get("avatar")).toBe(file);
    });

    it("should handle empty object", () => {
      const result = buildFormData({});

      // FormData should be created but empty
      expect(result instanceof FormData).toBe(true);
    });
  });

  describe("mergeFormData", () => {
    it("should merge multiple FormData objects", () => {
      const fd1 = new FormData();
      fd1.append("name", "John");
      fd1.append("email", "john@example.com");

      const fd2 = new FormData();
      fd2.append("age", "30");
      fd2.append("active", "true");

      const result = mergeFormData(fd1, fd2);

      expect(result.get("name")).toBe("John");
      expect(result.get("email")).toBe("john@example.com");
      expect(result.get("age")).toBe("30");
      expect(result.get("active")).toBe("true");
    });

    it("should preserve duplicate keys", () => {
      const fd1 = new FormData();
      fd1.append("tags", "javascript");

      const fd2 = new FormData();
      fd2.append("tags", "react");

      const result = mergeFormData(fd1, fd2);

      const tags = result.getAll("tags");
      expect(tags).toEqual(["javascript", "react"]);
    });

    it("should handle files in merge", () => {
      const file1 = new File(["content1"], "file1.txt");
      const file2 = new File(["content2"], "file2.txt");

      const fd1 = new FormData();
      fd1.append("document", file1);

      const fd2 = new FormData();
      fd2.append("document", file2);

      const result = mergeFormData(fd1, fd2);

      const documents = result.getAll("document") as File[];
      expect(documents).toHaveLength(2);
      expect(documents[0]).toBe(file1);
      expect(documents[1]).toBe(file2);
    });

    it("should merge single FormData", () => {
      const fd = new FormData();
      fd.append("key", "value");

      const result = mergeFormData(fd);

      expect(result.get("key")).toBe("value");
    });

    it("should merge empty FormData objects", () => {
      const fd1 = new FormData();
      const fd2 = new FormData();

      const result = mergeFormData(fd1, fd2);

      expect(result instanceof FormData).toBe(true);
    });
  });
});
